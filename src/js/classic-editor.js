import checkContent from './utils/check-content';
import replaceContent from './utils/replace';

const $ = jQuery;

$(document).on('click', '#publish', (event) => {
	if (
		!$(event.target).hasClass('disabled') &&
		$('.js-icw-force-checkbox').prop('checked') !== true
	) {
		checkContent(event);
	}
});

/**
 * If the preview button is clicked after
 * warnings are shown, re-enable a few things
 * that WordPress disables. Basically WordPress
 * isn't setup to fully work if you click on
 * the update button and then the preview button,
 * as it expects a page refresh after updates
 */
$(document).on('click', '#post-preview', () => {
	if (document.querySelector('.js-icw-error')) {
		if (wp.autosave) {
			wp.autosave.server.resume();
			wp.autosave.enableButtons();
		} else {
			$(document).trigger('autosave-enable-buttons');
		}

		$('#major-publishing-actions .spinner').removeClass('is-active');
	}
});

$(document).on('click', '.js-icw-check', function (e) {
	e.preventDefault();

	const spinner = $(this).next('.js-icw-spinner');
	const url = $(this).data('check');

	spinner.show();

	wp.apiRequest({ path: `/icw/v1/check?url=${url}` }).then(
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
				checkContent(e);
			}, 1000);
		},
		(err) => {
			// Don't recheck if replace unsuccessful.
			return err;
		},
	);
});
