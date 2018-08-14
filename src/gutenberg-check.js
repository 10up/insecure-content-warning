import { scanElements } from './scan-elements';

const SECURE_CONTENT_WARNING_ID = 'secure-content-warning';

export const gutenbergCheck = event => {
	const { select } = wp.data;

	// ... scan content, add warnings
	const content = select( 'core/editor' ).getEditedPostAttribute( 'content' );
	const $elements = jQuery.parseHTML( content );
	const scanResults = scanElements( jQuery( $elements ).find( '*' ).toArray() );

	const insecure = scanResults.insecure;
	const insecureElementURLs = scanResults.insecureElementURLs;

	const proceedCheckBoxChecked = jQuery( '#icw-force-checkbox' ).is( ':checked' );

	// Remove any previous notice.
	wp.data.dispatch( 'core/editor' ).removeNotice( SECURE_CONTENT_WARNING_ID );


	if ( insecure > 0 && ! proceedCheckBoxChecked ) {

		event.preventDefault();
		event.stopPropagation();

		// Show notices.
		const messages = [];
		const insecureItems = [];

		// Intro message.
		messages.push(
			wp.element.createElement( 'p',
				{ key: 'icw-p' },
				wp.i18n.sprintf(
					wp.i18n.__(
						insecureContentAdmin.error
					),
					insecure,
					insecure > 1 ? insecureContentAdmin.elements : insecureContentAdmin.element
				)
			)
		);

		// Details.
		insecureElementURLs.forEach( ( element, i ) => {
			insecureItems.push(
				wp.element.createElement( 'li',
					{ key: 'icw-li-' + i },
					[
						( i + 1 ) + '. ' + element,
						wp.element.createElement( 'a',
							{
								key: 'icw-a-' + i,
								'data-check': insecureElementURLs[i],
								href: '',
								className:'js-icw-check gutenberg-js-icw-check'
							},
							insecureContentAdmin.checkHttps,
						),
						wp.element.createElement( 'img',
							{
								key: 'icw-img-' + i,
								src: insecureContentAdmin.spinner,
								className: 'js-icw-spinner',
								style: { display: 'none' }
							}
						),
						wp.element.createElement( 'span',
							{
								key:'icw-span-' + i,
								className: 'js-icw-fixed',
								style: {
									display: 'none',
									color: 'forestgreen',
									fontWeight: 'bolder'
								}
							},
							insecureContentAdmin.success + '!'
						),
						wp.element.createElement( 'span',
							{
								key: 'icw-span2-' + i,
								className: 'error js-icw-error',
								style: {
									display: 'none',
									color: '#950e0d',
									fontWeight: 'bolder'
								}
							},
							insecureContentAdmin.imageNotFound
						)
					]
				)
			);
		} );

		messages.push(
			wp.element.createElement( 'ol',
				{
					key: 'icw-ol',
					className: 'js-icw-errors'
				},
				insecureItems
			)
		);

		messages.push(
			wp.element.createElement( 'br', { key: 'icw-br' } )
		);

		messages.push(
			wp.element.createElement( 'input',
				{
					key: 'icw-imput',
					id:'icw-force-checkbox',
					className:'js-icw-force-checkbox',
					type:'checkbox',
				}
			)
		);

		messages.push(
			wp.element.createElement( 'label',
				{
					key: 'icw-label',
					htmlFor: 'icw-force-checkbox',
				},
				insecureContentAdmin.disclaimer
			)
		);

		wp.data.dispatch( 'core/editor' ).createErrorNotice( messages, {
			id: SECURE_CONTENT_WARNING_ID,
		} );

		// Switch back to the main panel.
		setTimeout( () => wp.data.dispatch( 'core/edit-post' ).closePublishSidebar(), 0 );

		return false;
	}
	return true;
};
