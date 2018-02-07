/**
 * General theme functionality
 */

( function( $ ) {

	'use strict';

	$('#publish').on('click', function(event) {
		var insecure = 0;
		var $images;
		var insecureImageURLs = [];
		var $visualEditorWrap = $( document.getElementById( 'wp-content-wrap' ) );
		if ( $visualEditorWrap.hasClass('tmce-active') ||
				$visualEditorWrap.hasClass('tinymce-active') ) {
			$images = $('#content_ifr').contents().find('img');
		} else {
			$images = $('<div>').append( $.parseHTML( $('#content').val() ) ).find('img');
		}
		$images.each( function( index, el ) {
			if ( el.src && 'https://' !== el.src.substr( 0, 8 ) ) {
				insecure += 1;
				insecureImageURLs.push( el.src );
			}
		} );
		if (insecure > 0) {
			event.preventDefault();
			var $this = $(this);
			$('.wrap hr').next().remove();
			var html;
			var image = insecure > 1 ? 'images' : 'image';
			var $div = $(
				'<div>',
				{
					'class' : 'error',
					'html' :  insecure +  ' insecure ' + image + ' found. Please update image paths to https or save image to the media library and insert again.'
				}
			);
			html = '<ol>';
			for ( var i = 0, length = insecureImageURLs.length; i < length; i++ ) {
				html += '<li>' + insecureImageURLs[ i ] + '</li>';
			}
			html += '</ol>';
			html += '<p><strong>More Information:</strong></p><ol>' +
							'<li><a target="_blank" href="https://en.support.wordpress.com/add-media/">How to add media</a></li>' +
							'<li>' +
								'<a target="_blank" href="https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content">Mixed Content</a>' +
							'</li>' +
						'</ol>';
			$div.css({
				'padding' : '16px',
				'margin-top' : '16px',
			});
			$(html).appendTo($div);
			$('.wrap hr').after($div);
		}
	});


} ) ( jQuery );