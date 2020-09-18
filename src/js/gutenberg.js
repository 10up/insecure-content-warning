import { gutenbergCheck } from './utils/gutenberg-check';
import replaceContent from './utils/replace';

const { apiRequest, domReady } = wp;
const $ = jQuery;

domReady(() => {
	const publishBtn = document.querySelector(
		'.editor-post-publish-button, .editor-post-publish-panel__toggle',
	);

	if (publishBtn) {
		publishBtn.addEventListener('click', gutenbergCheck);
	}

	$(document).on('click', '.gutenberg-js-icw-check', function (e) {
		e.preventDefault();

		const spinner = $(this).next('.js-icw-spinner');
		const url = $(this).data('check');

		spinner.show();

		apiRequest({ path: `/icw/v1/check?url=${url}` }).then(
			(data) => {
				spinner.hide();

				// Attempt to replace if https equivalent found.
				if (data === true) {
					$(this).nextAll('.js-icw-fixed').show();
					replaceContent(url);
				} else {
					// show the error
					$(this).nextAll('.js-icw-error').show();
					throw new Error('No https equivalent found.');
				}

				setTimeout(function () {
					gutenbergCheck(e);
				}, 1000);
			},
			(err) => {
				// Don't recheck if replace unsuccessful.
				return err;
			},
		);
	});
});
