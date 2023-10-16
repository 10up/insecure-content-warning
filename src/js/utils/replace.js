/**
 * Replace the urls in post content
 *
 * @param {string} url URL to replace
 */
const replaceContent = (url = '') => {
	const replace = url.replace('http://', 'https://');
	const regex = new RegExp(url, 'g');

	if (jQuery('#wp-content-wrap').hasClass('html-active')) {
		const editor = document.getElementById('content');
		const content = editor.value;

		// update the textarea value
		editor.value = content.replace(regex, replace);
	} else if (typeof tinyMCE === 'object') {
		if (!tinyMCE.activeEditor) {
			// Update the block editor's content
			const content = wp.data
				.select('core/editor')
				.getEditedPostAttribute('content');
			const newContent = content.replace(regex, replace);

			wp.data
				.dispatch('core/block-editor')
				.resetBlocks(wp.blocks.parse(newContent));

			setTimeout(() => {
				jQuery(document).trigger('recheck-contents');
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
