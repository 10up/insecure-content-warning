/**
 * General theme functionality
 */

( function( $ ) {

	'use strict';

	$('#publish').on('click', function(event) {
		var $images = $('#content_ifr').contents().find('img');
		var insecure = 0;
		$images.each(function (index, el) {
			var $this = $(this);

			$this.css('border', '');

			if (el.src.startsWith('http://')) {
				$this.css('border', '1px solid red');
				insecure += 1;
			}
		});
		if (insecure > 0) {
			event.preventDefault();
			var $this = $(this);
			$('.wrap hr').next().remove();
			var image = insecure > 1 ? 'images' : 'image';
			var $div = $(
				'<div>',
				{
					'class' : 'error',
					'html' :  insecure +  ' insecure ' + image + ' found. Please update to https or save image to the media library and insert again.<br>' +
					'More information'
				}
			);
			var html = '<ol>' +
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
			$('body').animate({scrollTop: $div.offset().top - $('#wpadminbar').height()}, 500);
		}
	});


} ) ( jQuery );