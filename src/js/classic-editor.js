import checkContent from './utils/check-content';
import findElements from './utils/find-elements';
import replaceContent from './utils/replace';

const $ = jQuery;

// Listen for clicks on the publish button
$(document).on('click', '#publish', (event) => {
	if (
		!$(event.target).hasClass('disabled') &&
		$('.js-icw-force-checkbox').prop('checked') !== true
	) {
		checkContent(event);
	}
});

// Listen for clicks on the force publish checkbox
$(document).on('change', '#icw-force-checkbox', function () {
	// Enable or disable the publish button as needed
	if ($(this).is(':checked')) {
		$('#publish').removeClass('disabled');
	} else {
		$('#publish').addClass('disabled');
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

// Listen for clicks on the fix asset links
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

$(document).on('click', '.js-icw-view', function (e) {
	e.preventDefault();

	const url = $(this).data('check');
	const elements = findElements(url);

	if (elements.length) {
		const $element = $(elements[0]);

		$('html, body').animate(
			{
				scrollTop: $element.offset().top,
			},
			0,
		);
		$element.prop('data-mce-icw-is-insecure', 'yes');
		$element.addClass('js-icw-is-insecure');
	}
});
