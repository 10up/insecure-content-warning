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
		// translators: This is the warning content when insecure assets are found. Provides directions on how to fix.
		'error'           => esc_html__( '%s insecure %s found..', 'insecure-content-warning' ),
		'insecure'        => esc_html__( 'insecure', 'insecure-content-warning' ),
		'found'           => esc_html__( 'found', 'insecure-content-warning' ),
		'success'         => esc_html__( 'Success', 'insecure-content-warning' ),
	] );

}


