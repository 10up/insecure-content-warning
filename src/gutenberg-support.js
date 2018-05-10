export const enableGutenbergSupport = () => {
	const $ = jQuery;
	$( document ).on( 'ready', () => {

		setTimeout( () => {
			$( '.editor-post-publish-panel__toggle.button.button-primary' ).on( 'click', event => {
				event.preventDefault();
				// ... scan content, add warnings
			} );
		}, 500 );
	} );
};
