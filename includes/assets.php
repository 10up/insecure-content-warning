<?php
/**
 * Insecure Content Warning assets
 *
 * @package ICW
 */

namespace ICW\Assets;

/**
 * Setup actions and filters
 */
function setup() {
	add_action( 'init', __NAMESPACE__ . '\\load_translations' );
	add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\block_editor_scripts' );
	add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_scripts' );
	add_filter( 'mce_css', __NAMESPACE__ . '\\mce_css' );
}

/**
 * Load our script translations
 */
function load_translations() {
	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations( 'insecure-content-gutenberg', 'insecure-content-warning' );
		wp_set_script_translations( 'insecure-content-admin', 'insecure-content-warning' );
	}
}

/**
 * Enqueue editor-only JavaScript/CSS
 */
function block_editor_scripts() {
	wp_enqueue_script(
		'insecure-content-gutenberg',
		INSECURE_CONTENT_URL . 'dist/js/gutenberg.js',
		array( 'wp-components', 'wp-data', 'wp-dom', 'wp-editor', 'wp-element', 'wp-edit-post', 'wp-i18n', 'wp-plugins' ),
		INSECURE_CONTENT_VERSION,
		true
	);
	wp_enqueue_style(
		'insecure-content-gutenberg',
		INSECURE_CONTENT_URL . 'dist/css/editor-style.css',
		false,
		INSECURE_CONTENT_VERSION,
		'all'
	);
}

/**
 * Enqueue and localize script
 *
 * @param string $hook Page hook name.
 */
function enqueue_scripts( $hook = '' ) {
	if ( 'post-new.php' !== $hook && 'post.php' !== $hook ) {
		return;
	}

	wp_enqueue_script(
		'insecure-content-admin',
		INSECURE_CONTENT_URL . 'dist/js/classic-editor.js',
		array( 'wp-i18n' ),
		INSECURE_CONTENT_VERSION,
		true
	);

	wp_localize_script(
		'insecure-content-admin',
		'insecureContentAdmin',
		array(
			'spinner' => admin_url( '/images/wpspin_light.gif' ),
		)
	);

	wp_enqueue_style(
		'insecure-content-admin',
		INSECURE_CONTENT_URL . 'dist/css/admin-style.css',
		array(),
		INSECURE_CONTENT_VERSION,
	);
}

/**
 * Add plugin css to the TinyMCE editor
 *
 * @param string $mce_css Comma-separated stylesheet URLs.
 * @return string
 */
function mce_css( $mce_css = '' ) {

	$url     = INSECURE_CONTENT_URL . 'dist/css/editor-style.css';
	if ( empty( $mce_css ) ) {
		return $url;
	}
	$mce_css = $url . ',' . $mce_css;

	return $mce_css;
}
