// import replaceContent from './replace.js';
import checkContent from './checkContent';
import replaceContent from './replace';

const $ = jQuery;

$( document ).on( 'click', '#publish', event => {
	checkContent( event );
} );

$( document ).on( 'click', '.js-icw-check', function( e ) {
	e.preventDefault();
	const spinner = $( this ).next( '.js-icw-spinner' );
	spinner.show();
	const url = $( this ).data( 'check' );
	const response = fetch( `http://localhost/wp-json/icw/v1/check?url=${url}` );

	response.then( data => data.json() )
		.then( data => {
			spinner.hide();
			// if there is a working https equivalent, show the fix button.
			if ( data === true ) {
				$( this ).nextAll( '.js-icw-fix' ).show();
			} else {
				$( this ).nextAll( '.js-icw-error' ).show();
			}

		} );
} );


$( document ).on( 'click', '.js-icw-fix', function( event ) {
	event.preventDefault();
	const replace = $( this ).data( 'replace' );
	replaceContent( replace );
	checkContent( event );

} );
