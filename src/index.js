import { sprintf } from 'sprintf-js';
import { enableGutenbergSupport } from './gutenberg-support';
import { scanElements } from './scan-elements';
const $ = jQuery;

enableGutenbergSupport();

const $visualEditorWrap = $( document.getElementById( 'wp-content-wrap' ) );

$( '#publish' ).on( 'click', event => {
	let $elements;

	if ( $visualEditorWrap.hasClass( 'tmce-active' ) ||
		$visualEditorWrap.hasClass( 'tinymce-active' ) ) {
		$elements = $( '#content_ifr' ).contents().find( '*' );
	} else {
		$elements = $( '<div>' ).append( $.parseHTML( $( '#content' ).val() ) ).find( '*' );
	}

	const scanResults = scanElements( $elements );
	const insecure = scanResults.insecure;
	const insecureElementURLs = scanResults.insecureElementURLs;

	if ( insecure > 0 ) {
		event.preventDefault();

		const $hr = $( '.wrap hr' );

		$hr.next().remove();
		let html;
		let element = insecure > 1 ? insecureContentAdmin.elements : insecureContentAdmin.element;

		let $errorContainer = $(
			'<div>',
			{
				'class' : 'error',
				'html' :  sprintf( insecureContentAdmin.error, parseInt( insecure ), element )
			}
		);

		html = '<ol>';
		for ( let i = 0, length = insecureElementURLs.length; i < length; i++ ) {
			html += `<li>${insecureElementURLs[ i ]}</li>`;
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
			'margin-top' : '16px',
		} );

		$( html ).appendTo( $errorContainer );

		$hr.after( $errorContainer );
	}
} );
