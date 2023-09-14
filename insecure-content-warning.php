<?php
/**
 * Plugin Name:       Insecure Content Warning
 * Plugin URI:        https://wordpress.org/plugins/insecure-content-warning/
 * Description:       Prevent editors from adding insecure content in the editor.
 * Version:           1.1.0
 * Requires at least: 5.7
 * Requires PHP:      7.4
 * Author:            10up
 * Author URI:        https://10up.com/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       insecure-content-warning
 * Domain Path:       /languages/
 *
 * @package ICW
 */

namespace ICW;

define( 'INSECURE_CONTENT_URL', plugin_dir_url( __FILE__ ) );
define( 'INSECURE_CONTENT_TEMPLATE_URL', get_template_directory_uri() );
define( 'INSECURE_CONTENT_PATH', __DIR__ . DIRECTORY_SEPARATOR );
define( 'INSECURE_CONTENT_INC', INSECURE_CONTENT_PATH . 'includes' . DIRECTORY_SEPARATOR );
define( 'INSECURE_CONTENT_VERSION', '1.1.0' );

require_once INSECURE_CONTENT_INC . 'assets.php';
require_once INSECURE_CONTENT_INC . 'rest.php';
require_once INSECURE_CONTENT_INC . 'admin.php';
require_once INSECURE_CONTENT_INC . '/classes/class-fixinsecurecontent.php';

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	require_once INSECURE_CONTENT_INC . 'wp-cli/insecure-content-warning.php';
}

Assets\setup();
Rest\setup();
Admin\setup();
