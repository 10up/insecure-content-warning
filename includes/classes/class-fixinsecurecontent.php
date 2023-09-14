<?php
/**
 * Handles the fixing of insecure content in posts for REST and WP CLI requests.
 *
 * @package ICW
 */

namespace ICW\FIX;

use WP_CLI;
use WP_CLI\Utils;
use WP_CLI_Command;
use WP_Query;

/**
 * FixInsecureContent class.
 */
class FixInsecureContent {
	/**
	 * Is current run a dry run?
	 *
	 * @var bool
	 */
	private bool $dry_run;

	/**
	 * Total number of posts scanned for URLs.
	 *
	 * @var int
	 */
	private int $total_post_count = 1;

	/**
	 * Data of posts where 1 or more URLs were found to be insecure and command fixed summary.
	 *
	 * @var array
	 */
	private array $fixed_post_count = array();

	/**
	 * Array of warning messages.
	 *
	 * @var array
	 */
	private array $warning_count = array();

	/**
	 * Class instance
	 *
	 * @var ?FixInsecureContent
	 */
	protected static ?FixInsecureContent $instance = null;

	/**
	 * Get class instance
	 *
	 * @return FixInsecureContent
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Gets the "post_type" args for the WP_Query calls for the functionality to fix insecure content from within the admin UI.
	 *
	 * @return array
	 */
	public function get_wp_query_post_type_args(): array {
		return array(
			'show_ui'      => true,
			'show_in_rest' => true,
		);
	}

	/**
	 * Counts posts to be checked for insecure content.
	 *
	 * @param string $post_type      The post type.
	 * @param int    $posts_per_page The batch size.
	 * @param int    $post_offset    The post offset.
	 *
	 * @return int
	 */
	public function count_post_to_check( string $post_type, int $posts_per_page, int $post_offset ): int {
		// Exclude post from post types not shown in REST when counting insecure content to fix from the admin UI.
		$post_types = get_post_types( $this->get_wp_query_post_type_args() );

		$args = array(
			'posts_per_page' => $posts_per_page,
			'post_type'      => 'all' === $post_type ? $post_types : $post_type,
			'offset'         => $post_offset,
			'nopaging'       => true,
		);

		$query = new WP_Query( $args );

		return $query->found_posts;
	}

	/**
	 * Runs the fixing procedure for insecure content.
	 *
	 * @param bool|string $include        Comma separated IDs of post if fixing post content for multiple posts.
	 * @param bool        $all            Flag for running the fix on all posts.
	 * @param string      $post_type      The post type.
	 * @param int         $posts_per_page The batch size.
	 * @param int         $post_offset    The post offset.
	 * @param bool        $dry_run        Flag for dry or normal run.
	 * @param array       $args           WP CLI arguments.
	 *
	 * @return array|void
	 */
	public function fix( $include, $all, $post_type, $posts_per_page, $post_offset, $dry_run, $args = array() ) {
		$this->dry_run = $dry_run;

		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			WP_CLI::log( __( 'Checking post content...', 'insecure-content-warning' ) );
		}

		if ( false === $all && ! empty( $args[0] ) ) {
			$this->fix_insecure_content( $args[0] );
		} elseif ( false === $all && empty( $args ) && false !== $include ) {
			$post_ids_list = explode( ',', $include );
			foreach ( $post_ids_list as $icw_post_id ) {
				$this->fix_insecure_content( trim( $icw_post_id ) );
			}
			$this->total_post_count = count( $post_ids_list );
		} else {
			$total = 0;

			// Exclude post from post types not shown in REST when fixing insecure content from the admin UI.
			if ( ! defined( 'WP_CLI' ) && 'all' === $post_type ) {
				$post_type = get_post_types( $this->get_wp_query_post_type_args() );
			}

			// Loop through all posts and fix content.
			while ( true ) {
				$args  = array(
					'posts_per_page' => $posts_per_page,
					'post_type'      => $post_type,
					'offset'         => $post_offset,
					'orderby'        => 'ID',
					'order'          => 'ASC',
				);
				$query = new WP_Query( $args );

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

				if ( ! defined( 'WP_CLI' ) ) {
					// when fixing post in a REST request, do it only for the current batch and not until all the posts
					// have been fixed.
					break;
				}
			}

			$this->total_post_count = $total;
		}

		if ( defined( 'WP_CLI' ) && WP_CLI ) {
			// translators: Message to show when the fixing of insecure content is completed.
			$message = PHP_EOL . sprintf( __( 'Total posts checked for insecure URL(s): %s', 'insecure-content-warning' ), $this->total_post_count ) . PHP_EOL;
			WP_CLI::log( WP_CLI::colorize( "%c{$message}%n " ) );

			if ( empty( $this->fixed_post_count ) ) {
				WP_CLI::log( WP_CLI::colorize( '%c' . __( 'No post(s) found', 'insecure-content-warning' ) . '%n' ) );
			} else {
				Utils\format_items( 'table', $this->fixed_post_count, array( 'URL(s) fixed summary' ) );
			}
		} else {
			if ( empty( $this->fixed_post_count ) ) {
				return __( 'No post(s) found', 'insecure-content-warning' );
			}

			$output = '';

			foreach ( $this->warning_count as $warning ) {
				$warning_message = array_shift( $warning );
				$output         .= '<span class="warning">' . __( 'Warning', 'insecure-content-warning' ) . '</span>: ' . wp_strip_all_tags( $warning_message ) . PHP_EOL;
			}

			foreach ( $this->fixed_post_count as $fixed_post ) {
				$output .= array_shift( $fixed_post ) . PHP_EOL;
			}

			return $output;
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
		if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				// Return early, show error user can't edit the post.
				$this->warning_count[] = array( __( 'Warning', 'insecure-content-warning' ) => __( 'The current user doesn\'t have permission to edit posts.', 'insecure-content-warning' ) );
				return '';
			}
		}

		$current_post = get_post( $post_id );

		// Check and make sure post exists.
		if ( empty( $current_post ) ) {
			// translators: %d The Post ID being scanned for insecure content.
			$message = sprintf( __( 'Unable to fetch details for post %d', 'insecure-content-warning' ), $post_id );
			if ( defined( 'WP_CLI' ) && WP_CLI ) {
				WP_CLI::warning( $message );
			} else {
				$this->warning_count[] = array( __( 'Warning', 'insecure-content-warning' ) => $message );
			}
			return '';
		}

		// Loop through post content and get HTTPS URLs wherever possible.
		$post_content = $current_post->post_content;
		$urls         = $this->parse_content_for_insecure_urls( $post_content );
		$count        = 0;

		// Check if post content has insecure URLs.
		if ( empty( $urls ) ) {
			// translators: %d The Post ID being scanned for insecure content.
			$message = sprintf( __( 'No insecure content URL found in post %d', 'insecure-content-warning' ), $post_id );
			if ( defined( 'WP_CLI' ) && WP_CLI ) {
				WP_CLI::warning( $message );
			} else {
				$this->warning_count[] = array( __( 'Warning', 'insecure-content-warning' ) => $message );
			}

			if ( $this->dry_run ) {
				// translators: %d The Post ID being scanned for insecure content.
				$this->fixed_post_count[] = array( __( 'URL(s) fixed summary', 'insecure-content-warning' ) => sprintf( __( '0/0 URL(s) will be fixed in post %d', 'insecure-content-warning' ), $post_id ) );
			} else {
				// translators: %d The Post ID being scanned for insecure content.
				$this->fixed_post_count[] = array( __( 'URL(s) fixed summary', 'insecure-content-warning' ) => sprintf( __( '0/0 URL(s) fixed in post %d', 'insecure-content-warning' ), $post_id ) );
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
			// translators: 1: Number of insecure URLs updated, 2: Number of insecure URLs in post, 3: The post ID.
			$dry_run_message = sprintf( __( '%1$d/%2$d insecure URLs will be fixed in post %3$d.', 'insecure-content-warning' ), $count, count( $urls ), $post_id );
			if ( defined( 'WP_CLI' ) && WP_CLI ) {
				WP_CLI::debug( $dry_run_message );
			}
			$this->fixed_post_count[] = array( 'URL(s) fixed summary' => $dry_run_message );
		} else {
			// translators: 1: Number of insecure URLs updated, 2: Number of insecure URLs in post, 3: The post ID.
			$success_message = sprintf( __( '%1$d/%2$d insecure URLs fixed in post %3$d.', 'insecure-content-warning' ), $count, count( $urls ), $post_id );
			if ( defined( 'WP_CLI' ) && WP_CLI ) {
				WP_CLI::debug( $success_message );
			}
			$this->fixed_post_count[] = array( 'URL(s) fixed summary' => $success_message );
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
		$response              = wp_remote_head( $ssl );
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
