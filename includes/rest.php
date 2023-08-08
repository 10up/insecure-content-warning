<?php
/**
 * Add content checker rest endpoint
 *
 * @package ICW
 */

namespace ICW\Rest;

use ICW\FIX\FixInsecureContent;
use WP_REST_Request;
use WP_REST_Response;

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
	register_rest_route(
		'icw/v1',
		'/check/',
		array(
			'methods'             => 'GET',
			'callback'            => __NAMESPACE__ . '\\check_endpoint',
			'permission_callback' => '__return_true',
		)
	);

	register_rest_route(
		'icw/v1',
		'/count-for-fix/',
		array(
			'methods'             => 'POST',
			'callback'            => __NAMESPACE__ . '\\count_for_fix_endpoint',
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
			'args'                => array(
				'postIds'       => array(
					'type'              => array( 'bool', 'string' ),
					'sanitize_callback' => function ( $value ) {
						if ( empty( $value ) ) {
							return false;
						}

						return is_bool( $value ) ? rest_sanitize_boolean( $value ) : sanitize_text_field( $value );
					},
				),
				'batchSize'     => array(
					'type'              => 'int',
					'default'           => 10,
					'validate_callback' => function( $param ) {
						return is_int( $param );
					},
					'sanitize_callback' => function ( $value ) {
						return ! empty( $value ) ? absint( $value ) : 10;
					},
				),
				'postSelection' => array(
					'type'              => 'string',
					'default'           => 'all',
					'validate_callback' => function( $param ) {
						$allowed_post_selection_options = array(
							'all',
							'posts',
							'all_from_post_type',
						);

						return in_array( $param, $allowed_post_selection_options, true );
					},
					'sanitize_callback' => function ( $value ) {
						return ! empty( $value ) ? sanitize_text_field( $value ) : 'all';
					},
				),
				'postType'      => array(
					'type'              => 'string',
					'default'           => '',
					'validate_callback' => function( $param ) {
						if ( '' === $param ) {
							return true;
						}

						$allowed_post_types = array_keys( get_post_types() );

						return in_array( $param, $allowed_post_types, true );
					},
					'sanitize_callback' => function ( $value ) {
						return ! empty( $value ) ? sanitize_text_field( $value ) : 'post';
					},
				),
			),
		)
	);

	register_rest_route(
		'icw/v1',
		'/fix/',
		array(
			'methods'             => 'POST',
			'callback'            => __NAMESPACE__ . '\\fix_endpoint',
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
			'args'                => array(
				'postIds'       => array(
					'type'              => array( 'bool', 'string' ),
					'sanitize_callback' => function ( $value ) {
						if ( empty( $value ) ) {
							return false;
						}

						return is_bool( $value ) ? rest_sanitize_boolean( $value ) : sanitize_text_field( $value );
					},
				),
				'batchSize'     => array(
					'type'              => 'int',
					'default'           => 10,
					'validate_callback' => function( $param ) {
						return is_int( $param );
					},
					'sanitize_callback' => function ( $value ) {
						return ! empty( $value ) ? absint( $value ) : 10;
					},
				),
				'postSelection' => array(
					'type'              => 'string',
					'default'           => 'all',
					'validate_callback' => function( $param ) {
						$allowed_post_selection_options = array(
							'all',
							'posts',
							'all_from_post_type',
						);

						return in_array( $param, $allowed_post_selection_options, true );
					},
					'sanitize_callback' => function ( $value ) {
						return ! empty( $value ) ? sanitize_text_field( $value ) : 'all';
					},
				),
				'postType'      => array(
					'type'              => 'string',
					'default'           => '',
					'validate_callback' => function( $param ) {
						if ( '' === $param ) {
							return true;
						}

						$allowed_post_types = array_keys( get_post_types() );

						return in_array( $param, $allowed_post_types, true );
					},
					'sanitize_callback' => function ( $value ) {
						return ! empty( $value ) ? sanitize_text_field( $value ) : 'post';
					},
				),
				'dryRun'        => array(
					'type'              => 'bool',
					'default'           => true,
					'validate_callback' => function( $param ) {
						return is_bool( $param );
					},
					'sanitize_callback' => function ( $value ) {
						if ( false === $value ) {
							return false;
						}

						return true;
					},
				),
				'offset'        => array(
					'type'              => 'int',
					'default'           => 0,
					'validate_callback' => function( $param ) {
						return is_int( $param );
					},
					'sanitize_callback' => function ( $value ) {
						return ! empty( $value ) ? absint( $value ) : 0;
					},
				),
			),
		)
	);
}

/**
 * Endpoint for asset checker
 *
 * @param WP_REST_Request $request Request object.
 *
 * @return WP_REST_Response
 */
function check_endpoint( $request ) {
	$params                = $request->get_params();
	$url                   = isset( $params['url'] ) ? $params['url'] : null;
	$ssl                   = preg_replace( '/^http:/i', 'https:', $url );
	$secure_version_exists = false;
	$response              = wp_remote_get( $ssl ); // @codingStandardsIgnoreLine.
	$response_code         = wp_remote_retrieve_response_code( $response );

	if ( 200 === $response_code ) {
		$secure_version_exists = true;
	}

	return rest_ensure_response( $secure_version_exists );
}

/**
 * Prepares the parameters for the fix-related endpoints from the provided WP_REST_Request
 *
 * @param WP_REST_Request $request Request object.
 *
 * @return array
 */
function prepare_fix_params( WP_REST_Request $request ): array {
	$params = $request->get_params();

	return array(
		'include'     => false === $params['postIds'] ? rest_sanitize_boolean( $params['postIds'] ) : sanitize_text_field( $params['postIds'] ),
		'all'         => 'all' === sanitize_text_field( $params['postSelection'] ),
		'post_type'   => 'all' !== sanitize_text_field( $params['postSelection'] ) ? sanitize_text_field( $params['postType'] ) : 'all',
		'batch_size'  => absint( $params['batchSize'] ),
		'post_offset' => isset( $params['offset'] ) ? absint( $params['offset'] ) : 0,
		'dry_run'     => ! empty( $params['dryRun'] ) && rest_sanitize_boolean( $params['dryRun'] ),
	);
}

/**
 * Endpoint for insecure content fixing
 *
 * @param WP_REST_Request $request Request object.
 *
 * @return WP_REST_Response
 */
function fix_endpoint( WP_REST_Request $request ): WP_REST_Response {
	$params = prepare_fix_params( $request );

	$fixed_post_count = FixInsecureContent::get_instance()->fix( $params['include'], $params['all'], $params['post_type'], $params['batch_size'], $params['post_offset'], $params['dry_run'] );

	return rest_ensure_response( $fixed_post_count ?? array() );
}

/**
 * Endpoint for counting the post the insecure content fixing will be applied to.
 *
 * @param WP_REST_Request $request Request object.
 *
 * @return WP_REST_Response
 */
function count_for_fix_endpoint( WP_REST_Request $request ): WP_REST_Response {
	$params = prepare_fix_params( $request );

	if ( ! empty( $params['include'] ) ) {
		return rest_ensure_response( count( explode( ',', trim( $params['include'] ) ) ) );
	}

	$posts_to_be_fixed_count = FixInsecureContent::get_instance()->count_post_to_check( $params['post_type'], $params['batch_size'], $params['post_offset'] );

	return rest_ensure_response( $posts_to_be_fixed_count ?? array() );
}
