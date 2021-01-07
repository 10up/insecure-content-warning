import { gutenbergScan } from './gutenberg-scan';
import { registerInsecureContentPlugin } from './gutenberg-status';

const { __ } = wp.i18n;
const { dispatch } = wp.data;
const { getPlugin, unregisterPlugin } = wp.plugins;
const SECURE_CONTENT_WARNING_ID = 'secure-content-warning';

export const gutenbergCheck = (event) => {
	// Scan content, add warnings
	const scanResults = gutenbergScan();
	const { insecure, insecureElementURLs } = scanResults;
	const proceedCheckBoxChecked = jQuery('.js-icw-force-checkbox input[type=checkbox]').is(
		':checked',
	);

	// Remove any previous notice.
	dispatch('core/notices').removeNotice(SECURE_CONTENT_WARNING_ID);

	// Remove previous warning panel
	if (getPlugin('insecure-warnings')) {
		unregisterPlugin('insecure-warnings');
	}

	if (insecure > 0 && !proceedCheckBoxChecked) {
		event.preventDefault();
		event.stopPropagation();

		/**
		 * The strings used in this sprintf for the 2nd placeholder are
		 * possibly already translated by this point. The placeholder
		 * in the 1st location should be an integer.
		 *
		 * @see /includes/assets.php - enqueue_scripts() function.
		 */
		// translators: 1: a number, 2: a singular or plural (NOTE: this may already have been translated in PHP).
		const message = wp.i18n.sprintf(
			__(insecureContentAdmin.error),
			insecure,
			insecure > 1 ? insecureContentAdmin.elements : insecureContentAdmin.element,
		);

		// Display notice
		dispatch('core/notices').createErrorNotice(message, {
			id: SECURE_CONTENT_WARNING_ID,
		});

		// Display detailed message in post status panel
		registerInsecureContentPlugin(insecureElementURLs);

		// Switch back to the main panel.
		setTimeout(() => dispatch('core/edit-post').closePublishSidebar(), 0);
		setTimeout(() => dispatch('core/edit-post').openGeneralSidebar('edit-post/document'), 0);
		setTimeout(() => document.querySelector('.insecure-warnings-panel').scrollIntoView(), 0);

		return false;
	}

	return true;
};