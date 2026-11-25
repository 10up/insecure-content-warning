<?php
/**
 * Plugin Name: Insecure Content Warning E2E Helpers
 * Description: Test-only support plugin for the E2E suite. Answers requests to example.com locally. Loaded only by .wp-env.test.json.
 * Version: 0.1.0
 *
 * @package ICW
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Answers requests to example.com without touching the network.
 *
 * The bulk fixer checks each insecure URL's https:// version before switching
 * to it. Every https://example.com URL answers 200 and every other
 * example.com URL 404, so the specs control which URLs are fixable and the
 * suite stays off the network. Requests to other hosts pass through.
 *
 * @param false|array|WP_Error $preempt Whether to preempt the request.
 * @param array                $args    Request arguments.
 * @param string               $url     Request URL.
 * @return false|array|WP_Error Fake response for example.com, $preempt otherwise.
 */
function insecure_content_warning_e2e_fake_example_com( $preempt, $args, $url ) {
	if ( 'example.com' !== wp_parse_url( $url, PHP_URL_HOST ) ) {
		return $preempt;
	}

	$code = 'https' === wp_parse_url( $url, PHP_URL_SCHEME ) ? 200 : 404;

	return array(
		'headers'  => array(),
		'body'     => '',
		'response' => array(
			'code'    => $code,
			'message' => get_status_header_desc( $code ),
		),
		'cookies'  => array(),
		'filename' => null,
	);
}
add_filter( 'pre_http_request', 'insecure_content_warning_e2e_fake_example_com', 10, 3 );
