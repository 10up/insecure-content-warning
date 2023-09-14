import blurInsecure from './utils/blur-insecure';
import checkContent from './utils/check-content';
import findElements from './utils/find-elements';
import replaceContent from './utils/replace';
import '../css/admin.scss';

// Listen for clicks on the publish button
jQuery(document).on('click', '#publish', (event) => {
	blurInsecure();
	if (
		!jQuery(event.target).hasClass('disabled') &&
		jQuery('.js-icw-force-checkbox').prop('checked') !== true
	) {
		checkContent(event);
	}
});

// Listen for clicks on the force publish checkbox
jQuery(document).on('change', '#icw-force-checkbox', function () {
	// Enable or disable the publish button as needed
	blurInsecure();
	if (jQuery(this).is(':checked')) {
		jQuery('#publish').removeClass('disabled');
	} else {
		jQuery('#publish').addClass('disabled');
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
jQuery(document).on('click', '#post-preview', () => {
	blurInsecure();
	if (document.querySelector('.js-icw-error')) {
		if (wp.autosave) {
			wp.autosave.server.resume();
			wp.autosave.enableButtons();
		} else {
			jQuery(document).trigger('autosave-enable-buttons');
		}

		jQuery('#major-publishing-actions .spinner').removeClass('is-active');
	}
});

// Listen for clicks on the fix asset links
jQuery(document).on('click', '.js-icw-check', function (e) {
	e.preventDefault();
	blurInsecure();

	const spinner = jQuery(this).next('.js-icw-spinner');
	const url = jQuery(this).data('check');

	spinner.show();

	wp.apiRequest({ path: `/icw/v1/check?url=${url}` }).then(
		(data) => {
			spinner.hide();

			// Attempt to replace if https equivalent found.
			if (data === true) {
				jQuery(this).nextAll('.js-icw-fixed').show();
				replaceContent(url);
			} else {
				// show the error
				jQuery(this).nextAll('.js-icw-error').show();
				throw new Error('No https equivalent found.');
			}

			setTimeout(function () {
				checkContent(e);
			}, 1000);
		},
		(err) => {
			// Don't recheck if replace unsuccessful.
			return err;
		}
	);
});

jQuery(document).on('click', '.js-icw-view', function (e) {
	e.preventDefault();
	blurInsecure();

	const url = jQuery(this).data('check');
	const elements = findElements(url);

	if (elements.length) {
		const $element = jQuery(elements[0]);

		jQuery('html, body').animate(
			{
				scrollTop: $element.offset().top,
			},
			0
		);

		$element.addClass('js-icw-is-insecure');
	}
});
