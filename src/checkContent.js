
const $ = jQuery;

const checkContent = event => {
	const $visualEditorWrap = $( document.getElementById( 'wp-content-wrap' ) );

	let insecure = 0;
	let $elements;
	let insecureElementURLs = [];
	let insecureElements = [];

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
			$( el ).addClass( 'icw-element-' + index );
		}

		if ( el.srcset && el.srcset.substr( 0, 8 ) !== 'https://' ) {
			insecure += 1;
			// remove query paramaters for display.
			const url = el.srcset.split( '?' )[0];
			insecureElementURLs.push( url );
			$( el ).addClass( 'icw-element-' + index );
		}

	} );

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
			let $span = $( '<span>', {
				'class': 'icw-list-item-description',
				'data-el': insecureElements[ insecureElementURLs[ i ] ],
				'text': insecureElementURLs[i]
			} );
			let $success = $( '<span>', {
				'class': 'js-icw-fixed',
				'style': 'display: none; color: forestgreen; font-weight: bolder',
				'text': insecureContentAdmin.success + '!'
			} );
			let $error = $( '<span>', {
				'class': 'js-icw-error',
				'style': 'display: none; color: #950e0d; font-weight: bolder',
				'text': insecureContentAdmin.imageNotFound
			} );

			$li.append( $span );
			$li.append( $br );
			$li.append( $a );
			$li.append( $spinner );
			$li.append( $success );
			$li.append( $error );
			$ol.append( $li );
		}
		let $p = $( '<p>' );
		let $strong = $( '<strong>', {
			'text': insecureContentAdmin.moreInformation + ':'
		} );
		let $ol2 = $( '<ol>' );
		let $li2 = $( '<li>' );
		let $a2 = $( '<a>', {
			'target':'_blank',
			'href': 'https://en.support.wordpress.com/add-media/',
			'text': insecureContentAdmin.howToAddMedia
		} );
		let $li3 = $( '<li>' );
		let $a3 = $( '<a>', {
			'target':'_blank',
			'href': 'https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content',
			'text': insecureContentAdmin.mixedContent
		} );
		let $p2 = $( '<p>' );
		let $label = $( '<label>', {
			'for': 'icw-force-checkbox',
			'text': insecureContentAdmin.disclaimer
		} );
		let $input = $( '<input>', {
			'type':'checkbox',
			'id':'icw-force-checkbox',
			'class':'js-icw-force-checkbox',
		} );
		$p.append( $strong );
		$li2.append( $a2 );
		$li3.append( $a3 );
		$ol2.append( $li2 ).append( $li3 );
		$label.prepend( $input );
		$p2.append( $label );

		$errorContainer.css( {
			'padding' : '16px',
			'margin' : '0'
		} );

		$errorContainer
			.append( $ol )
			.append( $p )
			.append( $ol2 )
			.append( $p2 );

		$hr.after( $errorContainer );
	} else {
		$( '.js-icw-error' ).remove();
		event.preventDefault();
	}
};

export default checkContent;
