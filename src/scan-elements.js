import { each } from 'underscore';

export const scanElements = ( $elements ) => {
	let insecureElementURLs = [];
	let insecure = 0;
	each( $elements, ( el ) => {
		if ( el.src && el.src.substr( 0, 8 ) !== 'https://' ) {
			insecure += 1;
			insecureElementURLs.push( el.src );
		}
	} );

	return {
		insecureElementURLs: insecureElementURLs,
		insecure: insecure
	};
};
