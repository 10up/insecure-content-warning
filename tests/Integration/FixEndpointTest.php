<?php
/**
 * Tests for the icw/v1/fix and icw/v1/count-for-fix REST routes.
 *
 * @package ICW
 */

namespace ICW\Tests\Integration;

use ICW\FIX\FixInsecureContent;
use ReflectionProperty;
use WP_REST_Request;
use WP_REST_Response;
use WP_UnitTestCase;

/**
 * Tests that the bulk fixer only rewrites URLs that have an https:// version,
 * only saves when the request is not a dry run, only touches posts the current
 * user may edit, and walks posts in the batches the Tools screen asks for.
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
	 * A post type shown in the admin UI and REST, used to isolate batches.
	 *
	 * @var string
	 */
	const BATCH_POST_TYPE = 'icw_batch_test';

	/**
	 * A post type hidden from the admin UI and REST.
	 *
	 * @var string
	 */
	const HIDDEN_POST_TYPE = 'icw_hidden_test';

	/**
	 * ID of the post holding both insecure URLs.
	 *
	 * @var int
	 */
	private $post_id;

	/**
	 * URLs the fake HTTP layer answers with 200; everything else gets 404.
	 *
	 * @var string[]
	 */
	private $available_urls = array();

	/**
	 * Logs in an administrator, creates the post and fakes the https:// checks.
	 *
	 * @return void
	 */
	public function set_up(): void {
		parent::set_up();

		register_post_type(
			self::BATCH_POST_TYPE,
			array(
				'show_ui'      => true,
				'show_in_rest' => true,
			)
		);
		register_post_type(
			self::HIDDEN_POST_TYPE,
			array(
				'show_ui'      => false,
				'show_in_rest' => false,
			)
		);

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

		$this->available_urls = array( str_replace( 'http://', 'https://', self::FIXABLE_URL ) );
		add_filter( 'pre_http_request', array( $this, 'fake_https_response' ), 10, 3 );
	}

	/**
	 * Removes the test post types.
	 *
	 * @return void
	 */
	public function tear_down(): void {
		unregister_post_type( self::BATCH_POST_TYPE );
		unregister_post_type( self::HIDDEN_POST_TYPE );

		parent::tear_down();
	}

	/**
	 * Answers 200 for the URLs in $available_urls and 404 for anything else.
	 *
	 * @param false|array $preempt     Whether to short-circuit the request.
	 * @param array       $parsed_args Request arguments.
	 * @param string      $url         Requested URL.
	 * @return array Fake response.
	 */
	public function fake_https_response( $preempt, $parsed_args, $url ): array {
		$code = in_array( $url, $this->available_urls, true ) ? 200 : 404;

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
	 * Sends a request to one of the plugin's fix routes.
	 *
	 * The fixer is a singleton that collects results per instance, so each
	 * request starts with a fresh one, as each REST request in production does.
	 * `postIds` defaults to false, as the Tools screen sends it.
	 *
	 * @param string $route  Route name under icw/v1.
	 * @param array  $params Request parameters.
	 * @return WP_REST_Response Route response.
	 */
	private function request( string $route, array $params ): WP_REST_Response {
		$instance = new ReflectionProperty( FixInsecureContent::class, 'instance' );
		if ( PHP_VERSION_ID < 80100 ) {
			// Needed before PHP 8.1 only; deprecated as a no-op since PHP 8.5.
			$instance->setAccessible( true );
		}
		$instance->setValue( null, null );

		$request = new WP_REST_Request( 'POST', '/icw/v1/' . $route );
		foreach ( array_merge( array( 'postIds' => false ), $params ) as $key => $value ) {
			$request->set_param( $key, $value );
		}

		return rest_do_request( $request );
	}

	/**
	 * Runs the fix route for the given posts.
	 *
	 * @param int[] $post_ids IDs of the posts to fix.
	 * @param array $params   Extra request parameters.
	 * @return WP_REST_Response Route response.
	 */
	private function fix_posts( array $post_ids, array $params = array() ): WP_REST_Response {
		return $this->request(
			'fix',
			array_merge(
				array(
					'postSelection' => 'posts',
					'postIds'       => implode( ',', $post_ids ),
				),
				$params
			)
		);
	}

	/**
	 * Creates a published post holding one insecure image.
	 *
	 * @param array $args Post arguments.
	 * @return int Post ID.
	 */
	private function create_insecure_post( array $args = array() ): int {
		return self::factory()->post->create(
			array_merge(
				array(
					'post_status'  => 'publish',
					'post_content' => '<img src="' . self::FIXABLE_URL . '" />',
				),
				$args
			)
		);
	}

	/**
	 * A real run switches only the URL with an https:// version and saves it.
	 *
	 * @return void
	 */
	public function test_fix_rewrites_only_urls_with_an_https_version(): void {
		$response = $this->fix_posts( array( $this->post_id ), array( 'dryRun' => false ) );

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

		$response = $this->fix_posts( array( $this->post_id ) );

		$this->assertSame( 200, $response->get_status() );
		$this->assertStringContainsString(
			sprintf( '1/2 insecure URLs will be fixed in post %d.', $this->post_id ),
			$response->get_data()
		);
		$this->assertSame( $before, get_post( $this->post_id )->post_content );
	}

	/**
	 * Running the fixer requires the edit_posts capability.
	 *
	 * @return void
	 */
	public function test_fix_requires_edit_posts(): void {
		$before = get_post( $this->post_id )->post_content;
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'subscriber' ) ) );

		$response = $this->fix_posts( array( $this->post_id ), array( 'dryRun' => false ) );

		$this->assertSame( 403, $response->get_status() );
		$this->assertSame( $before, get_post( $this->post_id )->post_content );
	}

	/**
	 * Counting the posts to fix requires the edit_posts capability.
	 *
	 * @return void
	 */
	public function test_count_for_fix_requires_edit_posts(): void {
		wp_set_current_user( self::factory()->user->create( array( 'role' => 'subscriber' ) ) );

		$response = $this->request( 'count-for-fix', array( 'postSelection' => 'all' ) );

		$this->assertSame( 403, $response->get_status() );
	}

	/**
	 * The fixer only changes posts the current user may edit.
	 *
	 * @return void
	 */
	public function test_fix_only_changes_posts_the_user_can_edit(): void {
		$others_post = $this->create_insecure_post( array( 'post_author' => get_current_user_id() ) );
		$before      = get_post( $others_post )->post_content;

		$author = self::factory()->user->create( array( 'role' => 'author' ) );
		wp_set_current_user( $author );
		$own_post = $this->create_insecure_post( array( 'post_author' => $author ) );

		$response = $this->request(
			'fix',
			array(
				'postSelection' => 'all',
				'batchSize'     => 100,
				'dryRun'        => false,
			)
		);

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( $before, get_post( $others_post )->post_content );
		$this->assertStringContainsString( 'src="https://example.com/fixable.jpg"', get_post( $own_post )->post_content );
	}

	/**
	 * "All posts" covers only post types shown in the admin UI and REST, and the
	 * count the Tools screen batches by covers the same posts.
	 *
	 * @return void
	 */
	public function test_all_posts_covers_only_post_types_shown_in_the_admin(): void {
		$count_before = $this->request( 'count-for-fix', array( 'postSelection' => 'all' ) )->get_data();

		$shown  = $this->create_insecure_post( array( 'post_type' => 'page' ) );
		$hidden = $this->create_insecure_post( array( 'post_type' => self::HIDDEN_POST_TYPE ) );
		$before = get_post( $hidden )->post_content;

		$count_after = $this->request( 'count-for-fix', array( 'postSelection' => 'all' ) )->get_data();
		$this->assertSame( $count_before + 1, $count_after );

		$this->request(
			'fix',
			array(
				'postSelection' => 'all',
				'batchSize'     => 100,
				'dryRun'        => false,
			)
		);

		$this->assertStringContainsString( 'src="https://example.com/fixable.jpg"', get_post( $shown )->post_content );
		$this->assertSame( $before, get_post( $hidden )->post_content );
	}

	/**
	 * Each request fixes one batch from the given offset, in ID order, so the
	 * Tools screen's consecutive offsets reach every post exactly once.
	 *
	 * @return void
	 */
	public function test_fix_handles_one_batch_per_request(): void {
		$posts = array(
			$this->create_insecure_post( array( 'post_type' => self::BATCH_POST_TYPE ) ),
			$this->create_insecure_post( array( 'post_type' => self::BATCH_POST_TYPE ) ),
			$this->create_insecure_post( array( 'post_type' => self::BATCH_POST_TYPE ) ),
		);
		$batch  = array(
			'postSelection' => 'all_from_post_type',
			'postType'      => self::BATCH_POST_TYPE,
			'batchSize'     => 2,
			'dryRun'        => false,
		);
		$secure = 'src="https://example.com/fixable.jpg"';

		$this->request( 'fix', array_merge( $batch, array( 'offset' => 0 ) ) );

		$this->assertStringContainsString( $secure, get_post( $posts[0] )->post_content );
		$this->assertStringContainsString( $secure, get_post( $posts[1] )->post_content );
		$this->assertStringContainsString( 'src="' . self::FIXABLE_URL . '"', get_post( $posts[2] )->post_content );

		$response = $this->request( 'fix', array_merge( $batch, array( 'offset' => 2 ) ) );

		$this->assertStringContainsString( $secure, get_post( $posts[2] )->post_content );
		$this->assertStringNotContainsString( sprintf( 'post %d.', $posts[0] ), $response->get_data() );
	}

	/**
	 * The https:// check ignores the query string and the fix keeps it.
	 *
	 * @return void
	 */
	public function test_fix_keeps_the_query_string(): void {
		$this->available_urls[] = 'https://example.com/versioned.jpg';
		$post_id                = $this->create_insecure_post(
			array( 'post_content' => '<img src="http://example.com/versioned.jpg?ver=2" />' )
		);

		$this->fix_posts( array( $post_id ), array( 'dryRun' => false ) );

		$this->assertStringContainsString(
			'src="https://example.com/versioned.jpg?ver=2"',
			get_post( $post_id )->post_content
		);
	}
}
