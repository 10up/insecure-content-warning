<?php
/**
 * Plugin Name:       Insecure Content Warning
 * Plugin URI:        https://wordpress.org/plugins/insecure-content-warning/
 * Description:       Prevent editors from adding insecure content in the editor.
 * Version:           1.2.1
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Author:            10up
 * Author URI:        https://10up.com/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       insecure-content-warning
 * Domain Path:       /languages/
 *
 * @package ICW
 */

namespace ICW;

define( 'INSECURE_CONTENT_URL', plugin_dir_url( __FILE__ ) );
define( 'INSECURE_CONTENT_TEMPLATE_URL', get_template_directory_uri() );
define( 'INSECURE_CONTENT_PATH', __DIR__ . DIRECTORY_SEPARATOR );
define( 'INSECURE_CONTENT_INC', INSECURE_CONTENT_PATH . 'includes' . DIRECTORY_SEPARATOR );
define( 'INSECURE_CONTENT_VERSION', '1.2.1' );

/**
 * Get the minimum version of PHP required by this plugin.
 *
 * @since 1.1.2
 *
 * @return string Minimum version required.
 */
function minimum_php_requirement() {
	return '7.4';
}

/**
 * Whether PHP installation meets the minimum requirements
 *
 * @since 1.1.2
 *
 * @return bool True if meets minimum requirements, false otherwise.
 */
function site_meets_php_requirements() {
	return version_compare( phpversion(), minimum_php_requirement(), '>=' );
}

// Try to load the plugin files, ensuring our PHP version is met first.
if ( ! site_meets_php_requirements() ) {
	add_action(
		'admin_notices',
		function() {
			?>
			<div class="notice notice-error">
				<p>
					<?php
					echo wp_kses_post(
						sprintf(
							/* translators: %s: Minimum required PHP version */
							__( 'Insecure Content Warning requires PHP version %s or later. Please upgrade PHP or disable the plugin.', 'insecure-content-warning' ),
							esc_html( minimum_php_requirement() )
						)
					);
					?>
				</p>
			</div>
			<?php
		}
	);
	return;
}

require_once INSECURE_CONTENT_INC . 'assets.php';
require_once INSECURE_CONTENT_INC . 'rest.php';
require_once INSECURE_CONTENT_INC . 'admin.php';
require_once INSECURE_CONTENT_INC . '/classes/class-fixinsecurecontent.php';

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	require_once INSECURE_CONTENT_INC . 'wp-cli/insecure-content-warning.php';
}

Assets\setup();
Rest\setup();
Admin\setup();
