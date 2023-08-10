import { debounce } from 'underscore';
import { getScrollContainer } from '@wordpress/dom';
import apiRequest from '@wordpress/api-request';
import domReady from '@wordpress/dom-ready';
import { useEffect } from '@wordpress/element';
import {
	dispatch,
	select,
	subscribe,
	useDispatch,
	useSelect,
} from '@wordpress/data';
import { useShortcut } from '@wordpress/keyboard-shortcuts';
import { registerPlugin } from '@wordpress/plugins';
import { __ } from '@wordpress/i18n';
import blurInsecure from './utils/blur-insecure';
import replaceContent from './utils/replace';
import { gutenbergCheck } from './utils/gutenberg-check';
import '../css/editor.scss';

/**
 * Component that redefines what `primary + S` shortcut does.
 * It still saves post, but only after performing the
 * insecure warning checks.
 */
const RedefineSaveShortcut = () => {
	const saveShortcutId = 'core/editor/save';
	const newSaveShortcutId = 'redefined-save-shortcut';
	const { unregisterShortcut, registerShortcut } = useDispatch(
		'core/keyboard-shortcuts'
	);
	const { savePost } = useDispatch('core/editor');
	const { isEditedPostDirty, isPostSavingLocked } = useSelect('core/editor');

	useEffect(() => {
		unregisterShortcut(saveShortcutId);
		registerShortcut({
			name: newSaveShortcutId,
			category: 'global',
			description: __('Save your changes.', 'insecure-content-warning'),
			keyCombination: {
				modifier: 'primary',
				character: 's',
			},
		});
	}, []);

	useShortcut(newSaveShortcutId, (event) => {
		event.preventDefault();
		const isSecure = gutenbergCheck(event);

		if (!isSecure) {
			return;
		}

		if (isPostSavingLocked()) {
			return;
		}

		if (!isEditedPostDirty()) {
			return;
		}

		savePost();
	});

	return null;
};

registerPlugin('insecure-content-warning-redefine-save-shortcut', {
	render: RedefineSaveShortcut,
});

domReady(() => {
	let content = select('core/editor').getEditedPostContent();
	let publishBtn = document.querySelector(
		'.editor-post-publish-button, .editor-post-publish-panel__toggle'
	);

	if (publishBtn) {
		publishBtn.addEventListener('click', gutenbergCheck);
	} else {
		const interval = setInterval(() => {
			publishBtn = document.querySelector(
				'.editor-post-publish-button, .editor-post-publish-panel__toggle'
			);

			if (publishBtn) {
				publishBtn.addEventListener('click', gutenbergCheck);
				clearInterval(interval);
			}
		}, 500);
	}

	// Unlock post saving when content changes
	subscribe(
		debounce(() => {
			const newContent = select('core/editor').getEditedPostContent();
			const isLocked = select('core/editor').isPostSavingLocked();
			if (content !== newContent && isLocked) {
				blurInsecure();
				dispatch('core/editor').unlockPostSaving(
					'insecureContentWarning'
				);
				content = newContent;
			}
		}, 1000)
	);

	jQuery(document).on('click', '.gutenberg-js-icw-check', function (e) {
		e.preventDefault();
		blurInsecure();

		const spinner = jQuery(this).next('.js-icw-spinner');
		const url = jQuery(this).data('check');

		spinner.show();

		apiRequest({ path: `/icw/v1/check?url=${url}` }).then(
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
					gutenbergCheck(e);
				}, 1000);
			},
			(err) => {
				// Don't recheck if replace unsuccessful.
				return err;
			}
		);
	});

	jQuery(document).on('click', '.gutenberg-js-icw-view', function (e) {
		e.preventDefault();
		blurInsecure();
		const url = jQuery(this).data('check');
		const blockEditor = select('core/block-editor');

		const insecureBlocks = blockEditor.getBlocks().filter((block) => {
			const found =
				block.attributes?.url === url ||
				block.attributes?.mediaUrl === url ||
				block.attributes?.src === url;
			return found;
		});

		if (insecureBlocks.length > 0) {
			const insecureBlock = document.querySelector(
				`[data-block="${insecureBlocks[0].clientId}"]`
			);
			const container = insecureBlock
				? getScrollContainer(insecureBlock)
				: null;

			if (insecureBlock && container) {
				insecureBlock.scrollIntoView();
				jQuery(`[data-block="${insecureBlocks[0].clientId}"]`).addClass(
					'js-icw-is-insecure'
				);
			}
		}
	});
});
