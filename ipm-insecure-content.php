<?php
/*
Plugin Name: Insecure Content Warning
Description: Add warning for insecure content when posting
Author: 10up
Author URI: http://10up.com/
Version: 1.0.0
Text Domain: insecure-content-warning
License: GPL version 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
*/

namespace TenUp\InsecureContent;

define( 'INSECURE_CONTENT_URL', plugin_dir_url( __FILE__ ) );
define( 'INSECURE_CONTENT_TEMPLATE_URL', get_template_directory_uri() );
define( 'INSECURE_CONTENT_PATH', __DIR__ . DIRECTORY_SEPARATOR );
define( 'INSECURE_CONTENT_INC', INSECURE_CONTENT_PATH . 'includes' . DIRECTORY_SEPARATOR );
define( 'INSECURE_CONTENT_VERSION', '1.0.1' );

add_action( 'admin_enqueue_scripts', function () {
	wp_enqueue_script(
		'insecure-content-admin',
		INSECURE_CONTENT_URL . "/assets/js/content-checker.js",
		[],
		INSECURE_CONTENT_VERSION,
		true
	);
} );