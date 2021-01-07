import checkContent from './utils/check-content';
import replaceContent from './utils/replace';

const $ = jQuery;

// Listen for clicks on the publish button
$(document).on('click', '#publish', (event) => {
	if ($('.js-icw-force-checkbox').prop('checked') !== true) {
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
