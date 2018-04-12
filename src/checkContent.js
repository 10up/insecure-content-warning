import {sprintf} from 'sprintf-js';

const $ = jQuery;

const checkContent = event => {
	const $visualEditorWrap = $( document.getElementById( 'wp-content-wrap' ) );

	let insecure = 0;
	let $elements;
	let insecureElementURLs = [];

	if ( $visualEditorWrap.hasClass( 'tmce-active' ) ||
		$visualEditorWrap.hasClass( 'tinymce-active' ) ) {
		$elements = $( '#content_ifr' ).contents().find( '*' );
	} else {
		$elements = $( '<div>' ).append( $.parseHTML( $( '#content' ).val() ) ).find( '*' );
	}

	$elements.each( ( index, el ) => {
		if ( el.src && el.src.substr( 0, 8 ) !== 'https://' ) {
			insecure += 1;
			// remove query paramaters for display.
			const url = el.src.split( '?' )[0];
			insecureElementURLs.push( url );
		}
	} );

	const $hr = $( '#major-publishing-actions' );

	if ( insecure > 0 ) {
		event.preventDefault();

		$hr.next().remove();
		let html;
		let element = insecure > 1 ? insecureContentAdmin.elements : insecureContentAdmin.element;

		let $errorContainer = $(
			'<div>',
			{
				'class' : 'error js-icw-error',
				'html' :  sprintf( insecureContentAdmin.error, parseInt( insecure ), element )
			}
		);

		html = '<ol>';
		for ( let i = 0, length = insecureElementURLs.length; i < length; i++ ) {
			html += `
			<li>
				${insecureElementURLs[i]} 
				<br>
				<a href="" class="js-icw-check" data-check="${insecureElementURLs[i]}">${insecureContentAdmin.checkHttps}</a>
				<img src="${insecureContentAdmin.spinner}" class="js-icw-spinner" style="display: none" >
				<a href="" class="js-icw-fix" data-replace="${insecureElementURLs[i]}" style="display: none">Fix</a>
				<span class="js-icw-error" style="display: none; color: #950e0d;">${insecureContentAdmin.imageNotFound}</a>
				
			</li>
			`;
		}
		html += '</ol>';
		html += `
			<p>
				<strong>${insecureContentAdmin.moreInformation}:</strong>
			</p>
			<ol>
				<li>
					<a target="_blank" href="https://en.support.wordpress.com/add-media/">${insecureContentAdmin.howToAddMedia}</a>
				</li>
				<li>
					<a target="_blank" href="https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content">${insecureContentAdmin.mixedContent}</a>
				</li>
			</ol>`;

		$errorContainer.css( {
			'padding' : '16px',
			'margin' : '0'
		} );

		$( html ).appendTo( $errorContainer );

		$hr.after( $errorContainer );
	} else {
		$( '.js-icw-error' ).remove();
		event.preventDefault();
	}
};

export default checkContent;
