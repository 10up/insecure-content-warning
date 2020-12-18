<?php
/**
 * Add content checker rest endpoint
 *
 * @package ICW
 */

namespace ICW\Rest;

/**
 * Setup actions and filters
 */
function setup() {
	add_action( 'rest_api_init', __NAMESPACE__ . '\\rest_routes' );
}

/**
 * Asset checker endpoint functionality
 */
function rest_routes() {
	register_rest_route( 'icw/v1', '/check/', [
		'methods'             => 'GET',
		'callback'            => __NAMESPACE__ . '\\check_endpoint',
		'permission_callback' => '__return_true',
	] );
}

/**
 * Endpoint for asset checker
 *
 * @param \WP_REST_Request $request
 *
 * @return \WP_REST_Response
 */
function check_endpoint( $request ) {
	$params                = $request->get_params();
	$url                   = isset( $params['url'] ) ? $params['url'] : null;
	$ssl                   = preg_replace( '/^http:/i', 'https:', $url );
	$secure_version_exists = false;
	$response              = wp_remote_get( $ssl ); // @codingStandardsIgnoreLine.
	$response_code = wp_remote_retrieve_response_code( $response );

	if ( 200 === $response_code ) {
		$secure_version_exists = true;
	}

	return rest_ensure_response( $secure_version_exists );
}
