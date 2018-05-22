import { scanElements } from './scan-elements';

export const enableGutenbergSupport = () => {
	const $ = jQuery;
	const SECURE_CONTENT_WARNING_ID = 'secure-content-warning';
	$( document ).ready( () => {
		if ( ! wp ) {
			return;
		}
		setTimeout( () => {

			$( document ).on(
				'click',
				'.editor-post-publish-panel__toggle.button.button-primary',
				event => {
					event.preventDefault();
					event.stopPropagation();
					const { select } = wp.data;

					// ... scan content, add warnings
					const content = select( 'core/editor' ).getEditedPostAttribute( 'content' );
					const $elements = $.parseHTML( content );
					const scanResults = scanElements( jQuery( $elements ).find( '*' ).toArray() );

					const insecure = scanResults.insecure;
					const insecureElementURLs = scanResults.insecureElementURLs;

					// Remove any previous notice.
					wp.data.dispatch( 'core/editor' ).removeNotice( SECURE_CONTENT_WARNING_ID );

					if ( insecure > 0 ) {

						// Show notices.
						const messages = [];

						// Intro message.
						messages.push(
							wp.element.createElement( 'span',
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
									( i + 1 )+ '. ' + element
								)
							);
						} );

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

						wp.data.dispatch( 'core/editor' ).createErrorNotice( messages, {
							id: SECURE_CONTENT_WARNING_ID,
							isDismissible: false
						} );

						// Switch back to the main panel.
						setTimeout( () => wp.data.dispatch( 'core/edit-post' ).closePublishSidebar(), 0 );

					}

					return false;
				} );
		}, 500 );
	} );
};
