<?php
/**
 * Plugin Name: Insecure Content Warning
 * Description: Display warnings to editors when attempting to publish a post with insecure (non-https) content.
 * Author: 10up
 * Author URI: http://10up.com/
 * Version: 1.0.0
 * Text Domain: insecure-content-warning
 * Domain Path: /lang/
 * License: GPL version 2 or later - http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

namespace HttpsCheck;

define( 'INSECURE_CONTENT_URL', plugin_dir_url( __FILE__ ) );
define( 'INSECURE_CONTENT_TEMPLATE_URL', get_template_directory_uri() );
define( 'INSECURE_CONTENT_PATH', __DIR__ . DIRECTORY_SEPARATOR );
define( 'INSECURE_CONTENT_INC', INSECURE_CONTENT_PATH . 'includes' . DIRECTORY_SEPARATOR );
define( 'INSECURE_CONTENT_VERSION', '1.0' );

add_action( 'admin_enqueue_scripts', function () {
	wp_enqueue_script(
		'insecure-content-admin',
		INSECURE_CONTENT_URL . 'dist/main.js',
		[],
		INSECURE_CONTENT_VERSION,
		true
	);

	wp_localize_script( 'insecure-content-admin', 'insecureContentAdmin', [
		'moreInformation' => esc_html__( 'More Information', 'insecure-content-warning' ),
		'howToAddMedia'   => esc_html__( 'How to add media', 'insecure-content-warning' ),
		'mixedContent'    => esc_html__( 'Mixed Content', 'insecure-content-warning' ),
		'error'           => esc_html__( '%d insecure %s found. Please update image paths to https or save image to the media library and insert again.', 'insecure-content-warning' ),
	] );
} );
