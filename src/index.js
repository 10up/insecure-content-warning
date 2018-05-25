// import replaceContent from './replace.js';
import checkContent from './checkContent';
import replaceContent from './replace';
import './insecure-content.css';
import { enableGutenbergSupport } from './gutenberg-support';

const $ = jQuery;

$( document ).on( 'ready', () => {
	if ( window.dtGutenberg ) {
		enableGutenbergSupport();
	}
} );

$( document ).on( 'click', '#publish', event => {
	if ( $( '.js-icw-force-checkbox' ).attr( 'checked' ) !== 'checked' ) {
		checkContent( event );
	}
} );

$( document ).on( 'click', '.js-icw-check', function ( e ) {
	e.preventDefault();
	const spinner = $( this ).next( '.js-icw-spinner' );
	spinner.show();
	const url = $( this ).data( 'check' );
	wp.apiRequest( { path: `/icw/v1/check?url=${url}` } )
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
			setTimeout( function() {
				checkContent( e );
			}, 1000 );
		},
		( err ) => { // Don't recheck if replace unsuccessful.
			return err;
		} );
} );
