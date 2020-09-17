import { scanElements } from './scan-elements';
import { registerInsecureContentPlugin } from './gutenberg-status';

const { __ } = wp.i18n;
const { dispatch, select } = wp.data;
const { getPlugin, unregisterPlugin } = wp.plugins;
const SECURE_CONTENT_WARNING_ID = 'secure-content-warning';

export const gutenbergCheck = (event) => {
	// Scan content, add warnings
	const content = select('core/editor').getEditedPostAttribute('content');
	const $elements = jQuery.parseHTML(content);
	const scanResults = scanElements(jQuery($elements).find('*').toArray());

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

		// Notice message
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

		return false;
	}

	return true;
};
