const $ = jQuery;

/**
 * Replace the urls in post content
 *
 * @param {string} url URL to replace
 */
const replaceContent = (url = '') => {
	const replace = url.replace('http://', 'https://');
	const regex = new RegExp(url, 'g');

	if ($('#wp-content-wrap').hasClass('html-active')) {
		const editor = document.getElementById('content');
		const content = editor.value;

		// update the textarea value
		editor.value = content.replace(regex, replace);
	} else if (typeof tinyMCE === 'object') {
		if (!tinyMCE.activeEditor) {
			const content = wp.data.select('core/editor').getEditedPostAttribute('content');
			const post = wp.data.select('core/editor').getCurrentPost();
			const newContent = content.replace(regex, replace);

			post.content = { raw: newContent };

			wp.data.dispatch('core/editor').setupEditor(post);

			setTimeout(() => {
				$(document).trigger('recheck-contents');
			}, 1000);
		} else {
			const content = tinyMCE.activeEditor.getContent();
			const newContent = content.replace(regex, replace);

			// Update tinyMCE's content
			tinyMCE.activeEditor.setContent(newContent);
		}
	}
};

export default replaceContent;
