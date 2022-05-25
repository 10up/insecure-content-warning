const $ = jQuery;

/**
 * Find element on page
 */
const blurInsecure = () => {
	const $visualEditorWrap = $(document.getElementById('wp-content-wrap'));
	let $insecure;

	if ($visualEditorWrap.hasClass('tmce-active') || $visualEditorWrap.hasClass('tinymce-active')) {
		$insecure = $('#content_ifr').contents().find('.js-icw-is-insecure');
	} else {
		$insecure = $('<div>')
			.append($.parseHTML($('#content').val()))
			.find('.js-icw-is-insecure');
	}

	$insecure.removeClass('js-icw-is-insecure');

	$('.js-icw-is-insecure').removeClass('js-icw-is-insecure');
};

export default blurInsecure;
