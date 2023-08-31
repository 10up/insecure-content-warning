import { _nx, sprintf } from '@wordpress/i18n';
import { dispatch } from '@wordpress/data';
import { getPlugin, unregisterPlugin } from '@wordpress/plugins';
import blurInsecure from './blur-insecure';
import { gutenbergScan } from './gutenberg-scan';
import { registerInsecureContentPlugin } from './gutenberg-status';

const SECURE_CONTENT_WARNING_ID = 'secure-content-warning';

export const gutenbergCheck = (event) => {
	blurInsecure();
	// Scan content, add warnings
	const scanResults = gutenbergScan();
	const { insecure, insecureElementURLs } = scanResults;
	const proceedCheckBoxChecked = jQuery(
		'.js-icw-force-checkbox input[type=checkbox]'
	).is(':checked');

	// Remove any previous notice.
	dispatch('core/notices').removeNotice(SECURE_CONTENT_WARNING_ID);

	// Remove previous warning panel
	if (getPlugin('insecure-warnings')) {
		unregisterPlugin('insecure-warnings');
	}

	// Unlock post saving
	dispatch('core/editor').unlockPostSaving('insecureContentWarning');

	if (insecure > 0 && !proceedCheckBoxChecked) {
		event.preventDefault();
		event.stopPropagation();

		// translators: 1: a number
		const message = sprintf(
			// translators: %d: Single insecure element found, %d: Multiple insecure elements found.
			_nx(
				'%d insecure element found.',
				'%d insecure elements found.',
				insecure,
				'number of insecure elements',
				'insecure-content-warning'
			),
			parseInt(insecure, 10)
		);

		// Display notice
		dispatch('core/notices').createErrorNotice(message, {
			id: SECURE_CONTENT_WARNING_ID,
		});

		// Display detailed message in post status panel
		registerInsecureContentPlugin(insecureElementURLs);

		// Switch back to the main panel.
		setTimeout(() => dispatch('core/edit-post').closePublishSidebar(), 0);
		setTimeout(
			() =>
				dispatch('core/edit-post').openGeneralSidebar(
					'edit-post/document'
				),
			0
		);
		setTimeout(() => {
			const insecureWarningsPanelEl = document.querySelector(
				'.insecure-warnings-panel'
			);

			if (insecureWarningsPanelEl) {
				insecureWarningsPanelEl.scrollIntoView();
			}
		}, 0);

		// Lock post saving
		dispatch('core/editor').lockPostSaving('insecureContentWarning');

		return false;
	}

	return true;
};
