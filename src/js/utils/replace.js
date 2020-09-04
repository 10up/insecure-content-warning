const $ = jQuery;

/**
 * Replace the urls in post content
 *
 * @param {string} url URL to replace
 */
const replaceContent = (url = '') => {
	const replace = url.replace('http://', 'https://');

	if ($('#wp-content-wrap').hasClass('html-active')) {
		const editor = document.getElementById('content');
		const content = editor.value;

		// update the textarea value
		editor.value = content.replace(url, replace);
	} else if (typeof tinyMCE === 'object') {
		if (!tinyMCE.activeEditor) {
			const content = wp.data.select('core/editor').getEditedPostAttribute('content');
			const post = wp.data.select('core/editor').getCurrentPost();
			const newContent = content.replace(url, replace);

			post.content = { raw: newContent };

			wp.data.dispatch('core/editor').setupEditor(post);

			setTimeout(() => {
				$(document).trigger('recheck-contents');
			}, 1000);
		} else {
			const content = tinyMCE.activeEditor.getContent();
			const newContent = content.replace(url, replace);

			// Update tinyMCE's content
			tinyMCE.activeEditor.setContent(newContent);
		}
	}
};

export default replaceContent;
