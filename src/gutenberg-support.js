import { gutenbergCheck } from './gutenberg-check';
export const enableGutenbergSupport = () => {
	const $ = jQuery;
	$( document ).ready( () => {
		if ( ! wp ) {
			return;
		}
		setTimeout( () => {

			$( document ).on(
				'click',
				'.editor-post-publish-panel__toggle.button.button-primary',
				gutenbergCheck
			);
			$( document ).on(
				'recheck-contents',
				gutenbergCheck
			);

		}, 500 );
	} );
};
