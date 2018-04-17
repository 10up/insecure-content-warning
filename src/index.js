// import replaceContent from './replace.js';
import checkContent from './checkContent';
import replaceContent from './replace';

const $ = jQuery;

$( document ).on( 'click', '#publish', event => {
	if ( $( '.js-icw-force-checkbox' ).attr( 'checked' ) !== 'checked' ) {
		checkContent( event );
	}
} );

let delay = ( time ) => ( result ) => new Promise( resolve => setTimeout( () => resolve( result ), time ) );

$( document ).on( 'click', '.js-icw-check', function ( e ) {
	e.preventDefault();
	const spinner = $( this ).next( '.js-icw-spinner' );
	spinner.show();
	const url = $( this ).data( 'check' );
	fetch( `http://localhost/wp-json/icw/v1/check?url=${url}` )
		.then( data => data.json() )
		.then( data => {
			spinner.hide();
			// Attempt to replace if https equivalent found.
			if ( data === true ) {
				$( this ).nextAll( '.js-icw-fixed' ).show();
				replaceContent( url );
			} else {
				// show the error and the
				$( this ).nextAll( '.js-icw-error' ).show();
				throw 'No https equivalent found.';
			}
		} )
		.then( delay( 1000 ) )
		.then( () => {
			checkContent( e );
		}, ( err ) => { // Don't recheck if replace unsuccessful.
			return err;
		} );
} );
