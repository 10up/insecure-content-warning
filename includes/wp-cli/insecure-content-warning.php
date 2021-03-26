<?php
/**
 * Insecure content warning wp-cli commands.
 *
 * @package ICW
 */

namespace ICW\CLI;

use WP_CLI;
use WP_CLI\Utils;
use WP_CLI_Command;

/**
 * Custom command to fix insecure content in post.
 *
 * ## EXAMPLES
 *
 *     # Fix single post content.
 *     $ wp icw fix 42
 *     Checking post content...
 *     Success: Fixed 4/4 insecure URLs in post 42.
 *
 *     # Fix multiple post content.
 *     $ wp icw fix 10 42
 *     Checking post content...
 *     Success: Fixed 4/4 insecure URLs in post 10.
 *     Success: Fixed 4/4 insecure URLs in post 42.
 *
 *     # Fix all post content.
 *     $ wp icw fix --all
 *     Checking post content...
 *     Success: Fixed 4/4 insecure URLs in post 22.
 *     Warning: Fixed 3/4 insecure URLs in post 34.
 *
 * @when    after_wp_load
 * @package ICW\CLI
 */
class InsecureContentWarning_CLI_Command extends \WP_CLI_Command {

	/**
	 * Is current run a dry run?
	 *
	 * @var bool
	 */
	private $dry_run;

	/**
	 * Fix insecure content.
	 *
	 * ## OPTIONS
	 *
	 * [<id>...]
	 * : IDs of post if fixing specific post content.
	 *
	 * [--all]
	 * : If set iterate through all post content, fix insecure media and report. This argument overrides targeted fix args.
	 *
	 * [--dry-run]
	 * : Run the command without making updates to post contnet.
	 *
	 * ## EXAMPLES
	 *
	 *     # Fix single post content.
	 *     $ wp icw fix 42
	 *     Checking post content...
	 *     Success: Fixed 4/4 insecure URLs in post 42.
	 *
	 *     # Fix multiple post content.
	 *     $ wp icw fix 10 42
	 *     Checking post content...
	 *     Success: Fixed 4/4 insecure URLs in post 10.
	 *     Success: Fixed 4/4 insecure URLs in post 42.
	 *
	 *     # Fix all post content.
	 *     $ wp icw fix --all
	 *     Checking post content...
	 *     Success: Fixed 4/4 insecure URLs in post 22.
	 *     Warning: Fixed 3/4 insecure URLs in post 34.
	 *
	 * @param array $args       arguments.
	 * @param array $assoc_args associate arguments.
	 */
	public function fix( $args, $assoc_args ) {
		$all           = Utils\get_flag_value( $assoc_args, 'all', false );
		$this->dry_run = Utils\get_flag_value( $assoc_args, 'dry-run', false );

		WP_CLI::log( 'Checking post content...' );

		if ( false === $all && ! empty( $args ) ) {
			foreach ( $args as $icw_post_id ) {
				$this->success_or_failure( $this->fix_insecure_content( $icw_post_id ) );
			}
		} else {
			$posts_per_page = 5;
			$offset         = 0;
			$total          = 0;

			// Loop through all posts and fix content.
			while ( true ) {
				$args  = array(
					'posts_per_page' => $posts_per_page,
					'post_type'      => 'post',
					'post_status'    => 'publish',
					'offset'         => $offset,
				);
				$query = new \WP_Query( $args );

				if ( $query->have_posts() ) {
					while ( $query->have_posts() ) {
						$query->the_post();
						$this->success_or_failure( $this->fix_insecure_content( get_the_ID() ) );
					}
				} else {
					break;
				}

				// Set offset for next page.
				$offset += $posts_per_page;
				$total  += $query->post_count;

				// Wait for a while before fixing the rest.
				usleep( 1000 );
			}
		}
	}

	/**
	 * Fix insecure content for given Post ID.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return array|string
	 */
	protected function fix_insecure_content( $post_id ) {
		$current_post = get_post( $post_id );

		// Check and make sure post exists.
		if ( empty( $current_post ) ) {
			WP_CLI::warning( "Unable to fetch details for post ${post_id}" );

			return '';
		}

		// Loop through post content and get HTTPS URLs wherever possible.
		$post_content = $current_post->post_content;
		$urls         = $this->parse_content_for_insecure_urls( $post_content );
		$count        = 0;

		// Check if post content has insecure URLs.
		if ( empty( $urls ) ) {
			WP_CLI::log( "No insecure content URL found in post ${post_id}" );

			return '';
		}

		foreach ( $urls as $url ) {
			if ( $this->does_secure_content_exist( $url ) ) {
				$ssl_url      = preg_replace( '/^http:/i', 'https:', $url );
				$post_content = str_replace( $url, $ssl_url, $post_content );
				$count ++;
			}
		}

		if ( false === $this->dry_run ) {
			// Update post content with HTTPS URLs.
			wp_update_post(
				array(
					'ID'           => $post_id,
					'post_content' => $post_content,
				)
			);
		}

		if ( $this->dry_run ) {
			return array(
				'success',
				sprintf( '%s/%s insecure URLs will be fixed in post %s.', $count, count( $urls ), $post_id ),
			);
		} else {
			return array(
				'success',
				sprintf( '%s/%s insecure URLs fixed in post %s.', $count, count( $urls ), $post_id ),
			);
		}

	}

	/**
	 * Check if a SSL version of the URL exists.
	 *
	 * @param string $url URL to check for SSL version.
	 *
	 * @return bool
	 */
	protected function does_secure_content_exist( $url ) {
		// Check if a https version of the URL exists.
		$secure_version_exists = false;
		$ssl                   = preg_replace( '/^http:/i', 'https:', $url );
		$response              = wp_remote_get( $ssl );
		$response_code         = wp_remote_retrieve_response_code( $response );

		if ( 200 === $response_code ) {
			$secure_version_exists = true;
		}

		return $secure_version_exists;
	}

	/**
	 * Create list of URLs.
	 *
	 * @param string $post_content Post Content.
	 *
	 * @return array
	 */
	protected function parse_content_for_insecure_urls( $post_content ) {
		// Check all src and create an orray of URLs to check https URL availability.
		$src_urls  = array();
		$src_regex = '/src="([^"]+)"/';
		preg_match_all( $src_regex, $post_content, $matches, PREG_SET_ORDER, 0 );

		// If we have matches, loop through and get clean URL.
		if ( ! empty( $matches ) ) {
			foreach ( $matches as $match ) {
				$matched_url = $match[1];
				$base_url    = explode( '?', $matched_url )[0];
				if ( 'https://' !== substr( $base_url, 0, 8 ) ) {
					$src_urls[] = $base_url;
				}
			}
		}

		return $src_urls;
	}

	/**
	 * Display success or warning based on response; return proper exit code.
	 *
	 * @param array $response Response from processing insecure content.
	 *
	 * @return int $status
	 */
	protected function success_or_failure( $response ) {
		if ( empty( $response ) ) {
			return;
		}

		list( $type, $msg ) = $response;
		if ( 'success' === $type ) {
			WP_CLI::success( $msg );
		} else {
			WP_CLI::warning( $msg );
		}
	}
}

// Register migration command.
\WP_CLI::add_command( 'icw', __NAMESPACE__ . '\\InsecureContentWarning_CLI_Command' );
