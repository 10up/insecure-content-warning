<?php
/**
 * Tests for the icw/v1/fix REST route.
 *
 * @package ICW
 */

namespace ICW\Tests\Integration;

use ICW\FIX\FixInsecureContent;
use ReflectionProperty;
use WP_REST_Request;
use WP_UnitTestCase;

/**
 * Tests that the bulk fixer only rewrites URLs that have an https:// version,
 * and only saves when the request is not a dry run.
 */
class FixEndpointTest extends WP_UnitTestCase {

	/**
	 * An insecure URL whose https:// version answers 200.
	 *
	 * @var string
	 */
	const FIXABLE_URL = 'http://example.com/fixable.jpg';

	/**
	 * An insecure URL whose https:// version does not exist.
	 *
	 * @var string
	 */
	const UNFIXABLE_URL = 'http://example.org/unfixable.jpg';

	/**
	 * ID of the post holding both insecure URLs.
	 *
	 * @var int
	 */
	private $post_id;

	/**
	 * Logs in an administrator, creates the post and fakes the https:// checks.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		// The fixer is a singleton that collects results per instance: start
		// each test with a fresh one, as each REST request in production does.
		$instance = new ReflectionProperty( FixInsecureContent::class, 'instance' );
		if ( PHP_VERSION_ID < 80100 ) {
			// Needed before PHP 8.1 only; deprecated as a no-op since PHP 8.5.
			$instance->setAccessible( true );
		}
		$instance->setValue( null, null );

		wp_set_current_user( self::factory()->user->create( array( 'role' => 'administrator' ) ) );

		$this->post_id = self::factory()->post->create(
			array(
				'post_content' => sprintf(
					'<img src="%1$s" /><img src="%2$s" />',
					self::FIXABLE_URL,
					self::UNFIXABLE_URL
				),
			)
		);

		add_filter( 'pre_http_request', array( $this, 'fake_https_response' ), 10, 3 );
	}

	/**
	 * Answers 200 for the https:// version of FIXABLE_URL and 404 for anything else.
	 *
	 * @param false|array $preempt     Whether to short-circuit the request.
	 * @param array       $parsed_args Request arguments.
	 * @param string      $url         Requested URL.
	 * @return array Fake response.
	 */
	public function fake_https_response( $preempt, $parsed_args, $url ): array {
		$code = str_replace( 'http://', 'https://', self::FIXABLE_URL ) === $url ? 200 : 404;

		return array(
			'headers'  => array(),
			'body'     => '',
			'response' => array(
				'code'    => $code,
				'message' => get_status_header_desc( $code ),
			),
			'cookies'  => array(),
			'filename' => null,
		);
	}

	/**
	 * Runs the fix route for the test post.
	 *
	 * @param array $params Extra request parameters.
	 * @return \WP_REST_Response Route response.
	 */
	private function fix_post( array $params = array() ) {
		$request = new WP_REST_Request( 'POST', '/icw/v1/fix' );
		$request->set_param( 'postSelection', 'posts' );
		$request->set_param( 'postIds', (string) $this->post_id );
		foreach ( $params as $key => $value ) {
			$request->set_param( $key, $value );
		}

		return rest_do_request( $request );
	}

	/**
	 * A real run switches only the URL with an https:// version and saves it.
	 *
	 * @return void
	 */
	public function test_fix_rewrites_only_urls_with_an_https_version(): void {
		$response = $this->fix_post( array( 'dryRun' => false ) );

		$this->assertSame( 200, $response->get_status() );
		$this->assertStringContainsString(
			sprintf( '1/2 insecure URLs fixed in post %d.', $this->post_id ),
			$response->get_data()
		);

		$content = get_post( $this->post_id )->post_content;
		$this->assertStringContainsString( 'src="https://example.com/fixable.jpg"', $content );
		$this->assertStringContainsString( 'src="' . self::UNFIXABLE_URL . '"', $content );
	}

	/**
	 * Without dryRun the route only reports what it would fix.
	 *
	 * @return void
	 */
	public function test_fix_is_a_dry_run_by_default(): void {
		$before = get_post( $this->post_id )->post_content;

		$response = $this->fix_post();

		$this->assertSame( 200, $response->get_status() );
		$this->assertStringContainsString(
			sprintf( '1/2 insecure URLs will be fixed in post %d.', $this->post_id ),
			$response->get_data()
		);
		$this->assertSame( $before, get_post( $this->post_id )->post_content );
	}
}
