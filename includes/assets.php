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
	add_action( 'admin_notices', __NAMESPACE__ . '\\compile_script_notice' );
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
	$asset_file = INSECURE_CONTENT_PATH . 'build/gutenberg.asset.php';
	if ( file_exists( $asset_file ) ) {
		$asset = require_once $asset_file;
		wp_enqueue_script(
			'insecure-content-gutenberg',
			INSECURE_CONTENT_URL . 'build/gutenberg.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);
		wp_enqueue_style(
			'insecure-content-gutenberg',
			INSECURE_CONTENT_URL . 'build/gutenberg.css',
			false,
			$asset['version'],
			'all'
		);
	}
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

	$asset_file = INSECURE_CONTENT_PATH . 'build/classic-editor.asset.php';
	if ( file_exists( $asset_file ) ) {
		$asset = require_once $asset_file;
		wp_enqueue_script(
			'insecure-content-admin',
			INSECURE_CONTENT_URL . 'build/classic-editor.js',
			$asset['dependencies'],
			$asset['version'],
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
			INSECURE_CONTENT_URL . 'build/classic-editor.css',
			false,
			$asset['version'],
		);
	}
}

/**
 * Enqueue admin-only JavaScript/CSS
 */
function admin_scripts() {
	$asset_file = INSECURE_CONTENT_PATH . 'build/admin.asset.php';
	if ( file_exists( $asset_file ) ) {
		$asset = require_once $asset_file;
		wp_enqueue_script(
			'insecure-content-admin',
			INSECURE_CONTENT_URL . 'build/admin.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		wp_enqueue_style(
			'insecure-content-admin',
			INSECURE_CONTENT_URL . 'build/classic-editor.css',
			false,
			$asset['version'],
		);
	}
}

/**
 * Display a notice about JS and CSS assets missing
 *
 * @return void
 */
function compile_script_notice() {
	$asset_file = INSECURE_CONTENT_PATH . 'build/gutenberg.asset.php';

	if ( file_exists( $asset_file ) ) {
		return;
	}

	?>
	<div class="notice notice-warning is-dismissible">
		<?php // translators: open and close <code></code> tags. ?>
		<p><?php printf( esc_html__( 'JavaScript and CSS required for Insecure Content Warning are missing. Looks like you are using the development version of the plugin. Please perform the build running %1$snpm install && npm run dev%2$s and reload the page.', 'insecure-content-warning' ), '<code>', '</code>' ); ?></p>
	</div>
	<?php
}

/**
 * Add plugin css to the TinyMCE editor
 *
 * @param string $mce_css Comma-separated stylesheet URLs.
 * @return string
 */
function mce_css( $mce_css = '' ) {

	$url = INSECURE_CONTENT_URL . 'build/gutenberg.css';
	if ( empty( $mce_css ) ) {
		return $url;
	}
	$mce_css = $url . ',' . $mce_css;

	return $mce_css;
}
