<?php
/**
 * Plugin Name: Insecure Content Warning
 * Description: Prevent editors from adding insecure content in the editor.
 * Author: 10up
 * Author URI: https://10up.com/
 * Version: 1.0.0
 * Text Domain: insecure-content-warning
 * Domain Path: /languages/
 * License: GPL version 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

namespace ICW;

define( 'INSECURE_CONTENT_URL', plugin_dir_url( __FILE__ ) );
define( 'INSECURE_CONTENT_TEMPLATE_URL', get_template_directory_uri() );
define( 'INSECURE_CONTENT_PATH', __DIR__ . DIRECTORY_SEPARATOR );
define( 'INSECURE_CONTENT_INC', INSECURE_CONTENT_PATH . 'includes' . DIRECTORY_SEPARATOR );
define( 'INSECURE_CONTENT_VERSION', '1.0' );

require_once( INSECURE_CONTENT_INC . 'assets.php' );
require_once( INSECURE_CONTENT_INC . 'rest.php' );

Assets\setup();
Rest\setup();
