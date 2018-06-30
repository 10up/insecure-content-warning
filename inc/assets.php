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
	add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_scripts' );
}

/**
 * Enqueue and localize script
 */
function enqueue_scripts() {
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
		'element'         => esc_html__( 'element', 'insecure-content-warning' ),
		'elements'        => esc_html__( 'elements', 'insecure-content-warning' ),
		'checkHttps'      => esc_html__( 'Fix this asset', 'insecure-content-warning' ),
		'imageNotFound'   => esc_html__( 'Unable to find https:// equivalent. Please replace manually.', 'insecure-content-warning' ),
		'spinner'         => admin_url( '/images/wpspin_light.gif' ),
		'disclaimer'      => esc_html__( 'Proceed publishing insecure assets.', 'insecure-content-warning' ),
		/**
		 * These placeholders are not intended to be translated here. They are
		 * used in a `wp.i18n.sprintf` call at a later point.
		 *
		 * Expected values -
		 *     1: a number.
		 *     2: singular (`element` above) or plural (`elements` above).
		 *
		 * @see: /src/gutenberg-check.js
		 */
		// translators: Please do not translate placeholders `%1$d` and `%2$s`.
		'error'           => esc_html__( '%1$d insecure %2$s found..', 'insecure-content-warning' ),
		'insecure'        => esc_html__( 'insecure', 'insecure-content-warning' ),
		'found'           => esc_html__( 'found', 'insecure-content-warning' ),
		'success'         => esc_html__( 'Success', 'insecure-content-warning' ),
	] );

	wp_enqueue_style(
		'insecure-content-admin',
		INSECURE_CONTENT_URL . 'dist/insecure-content-admin.css'
	);

}
