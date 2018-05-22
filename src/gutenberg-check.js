import { scanElements } from './scan-elements';

const SECURE_CONTENT_WARNING_ID = 'secure-content-warning';

export const gutenbergCheck = event => {
	event.preventDefault();
	event.stopPropagation();
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

		// Show notices.
		const messages = [];

		// Intro message.
		messages.push(
			wp.element.createElement( 'p',
				{ key: Math.random() },
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
			messages.push(
				wp.element.createElement( 'li',
					{ key: Math.random() },
					[
						( i + 1 ) + '. ' + element,
						wp.element.createElement( 'a',
							{
								key: Math.random(),
								'data-check': insecureElementURLs[i],
								href: '',
								className:'js-icw-check gutenberg-js-icw-check'
							},
							insecureContentAdmin.checkHttps
						)
					]

				)
			);

			messages.push(

			);

			messages.push(
				wp.element.createElement( 'img', {
					key: Math.random(),
					src: insecureContentAdmin.spinner,
					className: 'js-icw-spinner',
					style: { display: 'none' }
				} )
			);
		} );

		messages.push(
			wp.element.createElement( 'br', { key: Math.random() } )
		);

		messages.push(
			wp.element.createElement( 'p',
				{ key: Math.random() },
				wp.element.createElement( 'strong',
					{ key: Math.random() },
					insecureContentAdmin.moreInformation
				)
			)
		);



		messages.push(
			wp.element.createElement( 'ol',
				{ key: Math.random() },
				[
					wp.element.createElement( 'li',
						{ key: Math.random() },
						wp.element.createElement( 'a',
							{
								href: 'https://en.support.wordpress.com/add-media/'
							},
							insecureContentAdmin.howToAddMedia
						)
					),
					wp.element.createElement( 'li',
						{ key: Math.random() },
						wp.element.createElement( 'a',
							{
								href: 'https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content'
							},
							insecureContentAdmin.mixedContent
						)
					),
				]
			)
		);
		messages.push(
			wp.element.createElement( 'input',
				{
					key: Math.random(),
					id:'icw-force-checkbox',
					className:'js-icw-force-checkbox',
					type:'checkbox',
				}
			)
		);

		messages.push(
			wp.element.createElement( 'label',
				{
					key: Math.random(),
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
