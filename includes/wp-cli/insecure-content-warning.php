<?php // phpcs:disable WordPress.Files.FileName.InvalidClassFileName
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
 *     Total posts checked for insecure URL(s): 1
 *     +-----------------------------+
 *     |  URL(s) fixed summary       |
 *     +-----------------------------+
 *     | 0/0 URL(s) fixed in post 42 |
 *     +-----------------------------+
 *
 *     # Fix multiple post content.
 *     $ wp icw fix --include=10,42
 *     Checking post content...
 *     Total posts checked for insecure URL(s): 2
 *     +-----------------------------+
 *     | URL(s) fixed summary        |
 *     +-----------------------------+
 *     | 0/0 URL(s) fixed in post 10 |
 *     | 0/0 URL(s) fixed in post 42 |
 *     +-----------------------------+
 *
 *     # Fix all post content.
 *     $ wp icw fix --all
 *     Checking post content...
 *     Total posts checked for insecure URL(s): 22
 *     +-------------------------------------+
 *     | URL(s) fixed summary                |
 *     +-------------------------------------+
 *     | 0/0 URL(s) fixed in post 98         |
 *     | 0/0 URL(s) fixed in post 96         |
 *     | 0/0 URL(s) fixed in post 76         |
 *     | ...........................         |
 *     | 0/0 URL(s) fixed in post 6          |
 *     | 0/0 URL(s) fixed in post 1          |
 *     +-------------------------------------+
 *
 *     # Fix all page content.
 *     $ wp icw fix --all --post_type=page
 *     Checking post content...
 *     Total posts checked for insecure URL(s): 10
 *     +-------------------------------------+
 *     | URL(s) fixed summary                |
 *     +-------------------------------------+
 *     | 0/0 URL(s) fixed in post 98         |
 *     | 0/0 URL(s) fixed in post 96         |
 *     | 0/0 URL(s) fixed in post 76         |
 *     | ...........................         |
 *     | 0/0 URL(s) fixed in post 6          |
 *     | 0/0 URL(s) fixed in post 1          |
 *     +-------------------------------------+
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
	 * Total number of posts scanned for URLs.
	 *
	 * @var int
	 */
	private $total_post_count = 1;

	/**
	 * Data of posts where 1 or more URLs were found to be insecure and command fixed summary.
	 *
	 * @var array
	 */
	private $fixed_post_count;

	/**
	 * Data of posts that didn't have any insecure URLs.
	 *
	 * @var array
	 */
	private $no_url_post_count;

	/**
	 * Fix insecure content.
	 *
	 * ## OPTIONS
	 *
	 * [<id>]
	 * : ID of post if fixing specific post content.
	 *
	 * [--include]
	 * : Comma separated IDs of post if fixing post content for multiple posts.
	 *
	 * [--all]
	 * : If set iterate through all post content, fix insecure media and report. This argument overrides targeted fix args.
	 *
	 * [--post_type]
	 * : The post type. Default 'post'.
	 *
	 * [--limit]
	 * : Count of posts to process in batch. Default 10.
	 *
	 * [--offset]
	 * : Allows skipping n number of posts. Default 0.
	 *
	 * [--dry-run]
	 * : Run the command without making updates to post contnet.
	 *
	 * ## EXAMPLES
	 *
	 *     # Fix single post content.
	 *     $ wp icw fix 42
	 *     Checking post content...
	 *     Total posts checked for insecure URL(s): 1
	 *     +-----------------------------+
	 *     |  URL(s) fixed summary       |
	 *     +-----------------------------+
	 *     | 0/0 URL(s) fixed in post 42 |
	 *     +-----------------------------+
	 *
	 *     # Fix multiple post content.
	 *     $ wp icw fix --include=10,42
	 *     Checking post content...
	 *     Total posts checked for insecure URL(s): 2
	 *     +-----------------------------+
	 *     | URL(s) fixed summary        |
	 *     +-----------------------------+
	 *     | 0/0 URL(s) fixed in post 10 |
	 *     | 0/0 URL(s) fixed in post 42 |
	 *     +-----------------------------+
	 *
	 *     # Fix all post content.
	 *     $ wp icw fix --all
	 *     Checking post content...
	 *     Total posts checked for insecure URL(s): 22
	 *     +-------------------------------------+
	 *     | URL(s) fixed summary                |
	 *     +-------------------------------------+
	 *     | 0/0 URL(s) fixed in post 98         |
	 *     | 0/0 URL(s) fixed in post 96         |
	 *     | 0/0 URL(s) fixed in post 76         |
	 *     | ...........................         |
	 *     | 0/0 URL(s) fixed in post 6          |
	 *     | 0/0 URL(s) fixed in post 1          |
	 *     +-------------------------------------+
	 *
	 *     # Fix all page content.
	 *     $ wp icw fix --all --post_type=page
	 *     Checking post content...
	 *     Total posts checked for insecure URL(s): 10
	 *     +-------------------------------------+
	 *     | URL(s) fixed summary                |
	 *     +-------------------------------------+
	 *     | 0/0 URL(s) fixed in post 98         |
	 *     | 0/0 URL(s) fixed in post 96         |
	 *     | 0/0 URL(s) fixed in post 76         |
	 *     | ...........................         |
	 *     | 0/0 URL(s) fixed in post 6          |
	 *     | 0/0 URL(s) fixed in post 1          |
	 *     +-------------------------------------+
	 *
	 * @param array $args arguments.
	 * @param array $assoc_args associate arguments.
	 */
	public function fix( $args, $assoc_args ) {
		$include        = Utils\get_flag_value( $assoc_args, 'include', false );
		$all            = Utils\get_flag_value( $assoc_args, 'all', false );
		$post_type      = Utils\get_flag_value( $assoc_args, 'post_type', 'post' );
		$posts_per_page = Utils\get_flag_value( $assoc_args, 'limit', 10 );
		$post_offset    = Utils\get_flag_value( $assoc_args, 'offset', 0 );
		$this->dry_run  = Utils\get_flag_value( $assoc_args, 'dry-run', false );

		WP_CLI::log( 'Checking post content...' );

		if ( false === $all && ! empty( $args[0] ) ) {
			$this->fix_insecure_content( $args[0] );
		} elseif ( false === $all && empty( $args ) && false !== $include ) {
			$post_ids_list = explode( ',', $include );
			foreach ( $post_ids_list as $icw_post_id ) {
				$this->fix_insecure_content( $icw_post_id );
			}
			$this->total_post_count = count( $post_ids_list );
		} else {
			$total = 0;

			// Loop through all posts and fix content.
			while ( true ) {
				$args  = array(
					'posts_per_page' => $posts_per_page,
					'post_type'      => $post_type,
					'post_status'    => 'publish',
					'offset'         => $post_offset,
				);
				$query = new \WP_Query( $args );

				if ( $query->have_posts() ) {
					while ( $query->have_posts() ) {
						$query->the_post();
						$this->fix_insecure_content( get_the_ID() );
					}
				} else {
					break;
				}

				// Set offset for next page.
				$post_offset += $posts_per_page;
				$total       += $query->post_count;

				// Wait for a while before fixing the rest.
				usleep( 1000 );
			}

			$this->total_post_count = $total;
		}

		WP_CLI::log( PHP_EOL . WP_CLI::colorize( "%cTotal posts checked for insecure URL(s): {$this->total_post_count}%n " ) . PHP_EOL );
		Utils\format_items( 'table', $this->fixed_post_count, array( 'URL(s) fixed summary' ) );
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
			WP_CLI::debug( "No insecure content URL found in post ${post_id}" );
			if ( $this->dry_run ) {
				$this->fixed_post_count[] = array(
					'URL(s) fixed summary' => '0/0 URL(s) will be fixed in post ' . $post_id,
				);
			} else {
				$this->fixed_post_count[] = array(
					'URL(s) fixed summary' => '0/0 URL(s) fixed in post ' . $post_id,
				);
			}

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
			$dry_run_message = sprintf( '%s/%s insecure URLs will be fixed in post %s.', $count, count( $urls ), $post_id );
			WP_CLI::debug( $dry_run_message );
			$this->fixed_post_count[] = array(
				'URL(s) fixed summary' => $dry_run_message,
			);
		} else {
			$success_message = sprintf( '%s/%s insecure URLs fixed in post %s.', $count, count( $urls ), $post_id );
			WP_CLI::debug( $success_message );
			$this->fixed_post_count[] = array(
				'URL(s) fixed summary' => $success_message,
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
		// Check all src and create an array of URLs to check https URL availability.
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
}

// Register migration command.
\WP_CLI::add_command( 'icw', __NAMESPACE__ . '\\InsecureContentWarning_CLI_Command' );
