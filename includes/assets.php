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
	// wp_enqueue_script(

	// );
}

/**
 * Enqueue and localize script
 */
function enqueue_scripts() {
	wp_enqueue_script(
		'insecure-content-admin',
		INSECURE_CONTENT_URL . 'dist/js/classic-editor.js',
		[],
		INSECURE_CONTENT_VERSION,
		true
	);

	wp_localize_script( 'insecure-content-admin', 'insecureContentAdmin', [
		'element'         => esc_html__( 'element', 'insecure-content-warning' ),
		'elements'        => esc_html__( 'elements', 'insecure-content-warning' ),
		'checkHttps'      => esc_html__( 'Fix this', 'insecure-content-warning' ),
		'imageNotFound'   => esc_html__( 'Unable to find https:// equivalent. Please replace manually.', 'insecure-content-warning' ),
		'spinner'         => admin_url( '/images/wpspin_light.gif' ),
		'disclaimer'      => esc_html__( 'Publish with insecure assets', 'insecure-content-warning' ),
		// translators: This is the warning content when insecure assets are found. Provides directions on how to fix.
		'error'           => esc_html__( '%s insecure %s found.', 'insecure-content-warning' ),
		'insecure'        => esc_html__( 'insecure', 'insecure-content-warning' ),
		'found'           => esc_html__( 'found', 'insecure-content-warning' ),
		'success'         => esc_html__( 'Success', 'insecure-content-warning' ),
	] );

	wp_enqueue_style(
		'insecure-content-admin',
		INSECURE_CONTENT_URL . 'dist/css/admin-style.css'
	);

}
