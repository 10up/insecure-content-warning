import { each } from 'underscore';

export const scanElements = ( $elements ) => {
	let insecureElementURLs = [];
	let insecure = 0;
	each( $elements, ( el ) => {

		if ( el.src && el.src.substr( 0, 8 ) !== 'https://' ) {
			insecure += 1;
			// remove query parameters for display.
			const url = el.src.split( '?' )[0];
			insecureElementURLs.push( url );
		}

		if ( el.srcset && el.srcset.substr( 0, 8 ) !== 'https://' ) {
			insecure += 1;
			// remove query parameters for display.
			const url = el.srcset.split( '?' )[0];
			insecureElementURLs.push( url );
		}
	} );

	return {
		insecureElementURLs: insecureElementURLs,
		insecure: insecure
	};
};
