import { scanElements } from './scan-elements';

const $ = jQuery;

const checkContent = event => {
	const $visualEditorWrap = $( document.getElementById( 'wp-content-wrap' ) );

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

	const $hr = $( '#major-publishing-actions' );

	if ( insecure > 0 ) {
		event.preventDefault();

		$hr.next().remove();
		let element = insecure > 1 ? insecureContentAdmin.elements : insecureContentAdmin.element;

		let $errorContainer = $(
			'<div>',
			{
				'class': 'error js-icw-error',
				'text':  parseInt( insecure ) + ' ' +
					insecureContentAdmin.insecure + ' '
					+ element + ' ' + insecureContentAdmin.found + '.'
			}
		);

		let $ol = $( '<ol />' );

		for ( let i = 0, length = insecureElementURLs.length; i < length; i++ ) {
			let $li = $( '<li>', {
				'class': 'icw-list-item',
			} );
			let $br = $( '<br />' );
			let $a = $( '<a>', {
				'class': 'js-icw-check',
				'data-check': insecureElementURLs[i],
				'href': '',
				'text': insecureContentAdmin.checkHttps
			} );
			let $spinner = $( '<img>', {
				'src': insecureContentAdmin.spinner,
				'class': 'js-icw-spinner',
				'style':'display: none'
			} );
			let $url = $( '<code>', {
				'class': 'icw-list-item-description',
				'text': insecureElementURLs[i]
			} );
			let $success = $( '<span>', {
				'class': 'js-icw-fixed',
				'style': 'display: none; color: forestgreen; font-weight: bolder',
				'text': insecureContentAdmin.success + '!'
			} );
			let $error = $( '<span>', {
				'class': 'error js-icw-error',
				'style': 'display: none; color: #950e0d; font-weight: bolder',
				'text': insecureContentAdmin.imageNotFound
			} );

			$li.append( $url );
			$li.append( $br );
			$li.append( $a );
			$li.append( $spinner );
			$li.append( $success );
			$li.append( $error );
			$ol.append( $li );
		}
		let $p = $( '<p>' );
		let $label = $( '<label>', {
			'for': 'icw-force-checkbox',
			'text': insecureContentAdmin.disclaimer
		} );
		let $input = $( '<input>', {
			'type':'checkbox',
			'id':'icw-force-checkbox',
			'class':'js-icw-force-checkbox',
		} );
		$label.prepend( $input );
		$p.append( $label );

		$errorContainer.css( {
			'padding' : '16px',
			'margin' : '0'
		} );

		$errorContainer
			.append( $ol )
			.append( $p );

		$hr.after( $errorContainer );
	} else {
		$( '.js-icw-error' ).remove();
	}
};

export default checkContent;
