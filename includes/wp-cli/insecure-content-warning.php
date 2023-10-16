<?php // phpcs:disable WordPress.Files.FileName.InvalidClassFileName
/**
 * Insecure content warning wp-cli commands.
 *
 * @package ICW
 */

namespace ICW\CLI;

use ICW\FIX\FixInsecureContent;
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
		$dry_run        = Utils\get_flag_value( $assoc_args, 'dry-run', false );

		FixInsecureContent::get_instance()->fix( $include, $all, $post_type, $posts_per_page, $post_offset, $dry_run, $args );
	}
}

// Register migration command.
\WP_CLI::add_command( 'icw', __NAMESPACE__ . '\\InsecureContentWarning_CLI_Command' );
