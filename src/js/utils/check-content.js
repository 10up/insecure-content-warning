import blurInsecure from './blur-insecure';
import { scanElements } from './scan-elements';

const { __, _nx, sprintf } = wp.i18n;
const $ = jQuery;

const checkContent = (event) => {
	blurInsecure();
	const $visualEditorWrap = $(document.getElementById('wp-content-wrap'));

	let $elements;

	// Enable the publish button
	$('#publish').removeClass('disabled');

	if ($visualEditorWrap.hasClass('tmce-active') || $visualEditorWrap.hasClass('tinymce-active')) {
		$elements = $('#content_ifr').contents().find('*');
	} else {
		$elements = $('<div>')
			.append($.parseHTML($('#content').val()))
			.find('*');
	}

	const scanResults = scanElements($elements);
	const { insecure } = scanResults;
	const { insecureElementURLs } = scanResults;

	const $hr = $('#major-publishing-actions');

	if (insecure > 0) {
		event.preventDefault();

		// Disable the publish button
		$('#publish').addClass('disabled');

		$hr.next().remove();

		const $errorContainer = $('<div>', {
			class: 'error js-icw-error',
			text: sprintf(
				_nx(
					'%d insecure element found.',
					'%d insecure elements found.',
					insecure,
					'number of insecure elements',
					'insecure-content-warning',
				),
				parseInt(insecure, 10),
			),
		});

		const $ol = $('<ol />');

		for (let i = 0, { length } = insecureElementURLs; i < length; i++) {
			const $li = $('<li>', {
				class: 'icw-list-item',
			});
			const $br = $('<br />');
			const $view = $('<a>', {
				class: 'js-icw-view',
				'data-check': insecureElementURLs[i],
				href: '',
				text: __('View element', 'insecure-content-warning'),
			});
			const $a = $('<a>', {
				class: 'js-icw-check',
				'data-check': insecureElementURLs[i],
				href: '',
				text: __('Fix this', 'insecure-content-warning'),
			});
			const $spinner = $('<img>', {
				src: insecureContentAdmin.spinner,
				class: 'js-icw-spinner',
				style: 'display: none',
			});
			const $url = $('<code>', {
				class: 'icw-list-item-description',
				text: insecureElementURLs[i],
			});
			const $success = $('<span>', {
				class: 'js-icw-fixed',
				style: 'display: none; color: forestgreen; font-weight: bolder',
				text: __('Success!', 'insecure-content-warning'),
			});
			const $error = $('<span>', {
				class: 'error js-icw-error',
				style: 'display: none; color: #950e0d; font-weight: bolder',
				text: __(
					'Unable to find https:// equivalent. Please replace manually.',
					'insecure-content-warning',
				),
			});

			$li.append($url);
			$li.append($br);
			$li.append($view);
			$li.append($a);
			$li.append($spinner);
			$li.append($success);
			$li.append($error);
			$ol.append($li);
		}
		const $p = $('<p>');
		const $label = $('<label>', {
			for: 'icw-force-checkbox',
			text: __('Publish with insecure assets', 'insecure-content-warning'),
		});
		const $input = $('<input>', {
			type: 'checkbox',
			id: 'icw-force-checkbox',
			class: 'js-icw-force-checkbox',
		});
		$label.prepend($input);
		$p.append($label);

		$errorContainer.css({
			display: 'block',
			padding: '16px',
			margin: '0',
		});

		$errorContainer.append($ol).append($p);

		$hr.after($errorContainer);
	} else {
		$('.js-icw-error').remove();
	}
};

export default checkContent;
