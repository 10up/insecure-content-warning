<?php
/**
 * Insecure Content Warning assets
 *
 * @package ICW
 */

namespace ICW\Admin;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Setup actions and filters
 */
function setup() {
	add_action( 'admin_menu', __NAMESPACE__ . '\\admin_menu' );
}

/**
 * Register the admin menu.
 *
 * @return void
 */
function admin_menu() {
	$hook = add_management_page(
		__( 'Insecure Content Warning Admin', 'insecure-content-warning' ),
		__( 'Insecure Content Warning', 'insecure-content-warning' ),
		'edit_posts',
		'insecure-content-warning',
		__NAMESPACE__ . '\\admin_page'
	);

	add_action( 'admin_print_scripts-' . $hook, 'ICW\Assets\admin_scripts' );
}

/**
 * Load the admin page template.
 *
 * @return void
 */
function admin_page() {
	require_once __DIR__ . '/partials/admin-page.php';
}
