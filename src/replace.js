const $ = jQuery;

/**
 * Replace the urls in post content
 *
 * @param url
 */
const replaceContent = ( url = '' ) => {

	let replace = url.replace( 'http://', 'https://' );

	if ( $( '#wp-content-wrap' ).hasClass( 'html-active' ) ) {

		const editor     = document.getElementById( 'content' );
		const content    = editor.value;

		// update the textarea value
		editor.value = content.replace( url, replace );

	} else if ( typeof tinyMCE === 'object' ) {

		const content = tinyMCE.activeEditor.getContent();
		const newContent = content.replace( url, replace );

		// Update tinyMCE's content
		tinyMCE.activeEditor.setContent( newContent );
	}
};

export default replaceContent;
