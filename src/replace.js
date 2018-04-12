const $ = jQuery;

const replaceContent = ( url = '' ) => {

	let replace = url.replace( 'http://', 'https://' );

	if ( $( '#wp-content-wrap' ).hasClass( 'html-active' ) ) {
		const editor     = document.getElementById( 'content' );
		const content    = editor.value;

		// update the textarea value
		editor.value = content.replace( url, replace );

	} else if ( typeof tinyMCE === 'object' ) {

		const content = tinyMCE.getContent();
		const newContent = content.replace( url, replace );

		// Update tinyMCE's content
		tinyMCE.setContent( newContent );
	}
};

export default replaceContent;
