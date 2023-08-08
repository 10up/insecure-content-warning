/**
 * Find element on page
 */
const blurInsecure = () => {
	const $visualEditorWrap = jQuery(
		document.getElementById('wp-content-wrap')
	);
	let $insecure;

	if (
		$visualEditorWrap.hasClass('tmce-active') ||
		$visualEditorWrap.hasClass('tinymce-active')
	) {
		$insecure = jQuery('#content_ifr')
			.contents()
			.find('.js-icw-is-insecure');
	} else {
		$insecure = jQuery('<div>')
			.append(jQuery.parseHTML(jQuery('#content').val()))
			.find('.js-icw-is-insecure');
	}

	$insecure.removeClass('js-icw-is-insecure');

	jQuery('.js-icw-is-insecure').removeClass('js-icw-is-insecure');
};

export default blurInsecure;
