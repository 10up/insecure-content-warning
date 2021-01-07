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
	add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\block_editor_scripts' );
	add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );
}

/**
 * Enqueue editor-only JavaScript/CSS
 *
 * @return void
 */
function block_editor_scripts() {
	wp_enqueue_script(
		'insecure-content-gutenberg',
		INSECURE_CONTENT_URL . 'dist/js/gutenberg.js',
		[ 'wp-components', 'wp-data', 'wp-dom',  'wp-editor', 'wp-element', 'wp-edit-post', 'wp-i18n', 'wp-plugins' ],
		INSECURE_CONTENT_VERSION,
		true
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
		[],
		INSECURE_CONTENT_VERSION,
		true
	);

	wp_localize_script( 'insecure-content-admin', 'insecureContentAdmin', [
		'element'       => esc_html__( 'element', 'insecure-content-warning' ),
		'elements'      => esc_html__( 'elements', 'insecure-content-warning' ),
		'checkHttps'    => esc_html__( 'Fix this', 'insecure-content-warning' ),
		'imageNotFound' => esc_html__( 'Unable to find https:// equivalent. Please replace manually.', 'insecure-content-warning' ),
		'spinner'       => admin_url( '/images/wpspin_light.gif' ),
		'disclaimer'    => esc_html__( 'Publish with insecure assets', 'insecure-content-warning' ),
		/**
		 * These placeholders are not intended to be translated here. They are
		 * used in a `wp.i18n.sprintf` call at a later point.
		 *
		 * Expected values -
		 *     1: a number.
		 *     2: singular (`element` above) or plural (`elements` above).
		 *
		 * @see /src/js/utils/gutenberg-check.js
		 */
		// translators: Please do not translate placeholders `%1$d` and `%2$s`.
		'error'         => esc_html__( '%1$d insecure %2$s found.', 'insecure-content-warning' ),
		'insecure'      => esc_html__( 'insecure', 'insecure-content-warning' ),
		'found'         => esc_html__( 'found', 'insecure-content-warning' ),
		'success'       => esc_html__( 'Success', 'insecure-content-warning' ),
	] );

	wp_enqueue_style(
		'insecure-content-admin',
		INSECURE_CONTENT_URL . 'dist/css/admin-style.css'
	);
}