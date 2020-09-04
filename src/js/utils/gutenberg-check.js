import { scanElements } from './scan-elements';

const { __ } = wp.i18n;
const { dispatch, select } = wp.data;
const SECURE_CONTENT_WARNING_ID = 'secure-content-warning';

export const gutenbergCheck = (event) => {
	// Scan content, add warnings
	const content = select('core/editor').getEditedPostAttribute('content');
	const $elements = jQuery.parseHTML(content);
	const scanResults = scanElements(jQuery($elements).find('*').toArray());

	const { insecure } = scanResults;
	// const { insecureElementURLs } = scanResults;
	const proceedCheckBoxChecked = jQuery('#icw-force-checkbox').is(':checked');

	// Remove any previous notice.
	dispatch('core/notices').removeNotice(SECURE_CONTENT_WARNING_ID);

	if (insecure > 0 && !proceedCheckBoxChecked) {
		event.preventDefault();
		event.stopPropagation();

		// Error message.
		const message = wp.i18n.sprintf(
			__(insecureContentAdmin.error),
			insecure,
			insecure > 1 ? insecureContentAdmin.elements : insecureContentAdmin.element,
		);

		dispatch('core/notices').createErrorNotice(message, {
			id: SECURE_CONTENT_WARNING_ID,
		});

		// Switch back to the main panel.
		setTimeout(() => dispatch('core/edit-post').closePublishSidebar(), 0);

		return false;
	}

	return true;
};
