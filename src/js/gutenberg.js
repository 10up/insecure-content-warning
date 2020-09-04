import { gutenbergCheck } from './utils/gutenberg-check';

const { domReady } = wp;

domReady(() => {
	const publishBtn = document.querySelector(
		'.editor-post-publish-button, .editor-post-publish-panel__toggle',
	);

	if (publishBtn) {
		publishBtn.addEventListener('click', gutenbergCheck);
	}

	document.addEventListener('recheck-contents', gutenbergCheck);
});
