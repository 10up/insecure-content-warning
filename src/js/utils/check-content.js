import { __, _nx, sprintf } from '@wordpress/i18n';
import blurInsecure from './blur-insecure';
import { scanElements } from './scan-elements';

const checkContent = (event) => {
	blurInsecure();
	const $visualEditorWrap = jQuery(
		document.getElementById('wp-content-wrap')
	);

	let $elements;

	// Enable the publish button
	jQuery('#publish').removeClass('disabled');

	if (
		$visualEditorWrap.hasClass('tmce-active') ||
		$visualEditorWrap.hasClass('tinymce-active')
	) {
		$elements = jQuery('#content_ifr').contents().find('*');
	} else {
		$elements = jQuery('<div>')
			.append(jQuery.parseHTML(jQuery('#content').val()))
			.find('*');
	}

	const scanResults = scanElements($elements);
	const { insecure } = scanResults;
	const { insecureElementURLs } = scanResults;

	const $hr = jQuery('#major-publishing-actions');

	if (insecure > 0) {
		event.preventDefault();

		// Disable the publish button
		jQuery('#publish').addClass('disabled');

		$hr.next().remove();

		const $errorContainer = jQuery('<div>', {
			class: 'error js-icw-error',
			text: sprintf(
				// translators: %d: Single insecure element found, %d: Multiple insecure elements found.
				_nx(
					'%d insecure element found.',
					'%d insecure elements found.',
					insecure,
					'number of insecure elements',
					'insecure-content-warning'
				),
				parseInt(insecure, 10)
			),
		});

		const $ol = jQuery('<ol />');

		for (let i = 0, { length } = insecureElementURLs; i < length; i++) {
			const $li = jQuery('<li>', {
				class: 'icw-list-item',
			});
			const $br = jQuery('<br />');
			const $view = jQuery('<a>', {
				class: 'js-icw-view',
				'data-check': insecureElementURLs[i],
				href: '',
				text: __('View element', 'insecure-content-warning'),
			});
			const $a = jQuery('<a>', {
				class: 'js-icw-check',
				'data-check': insecureElementURLs[i],
				href: '',
				text: __('Fix this', 'insecure-content-warning'),
			});
			const $spinner = jQuery('<img>', {
				src: insecureContentAdmin.spinner,
				class: 'js-icw-spinner',
				style: 'display: none',
			});
			const $url = jQuery('<code>', {
				class: 'icw-list-item-description',
				text: insecureElementURLs[i],
			});
			const $success = jQuery('<span>', {
				class: 'js-icw-fixed',
				style: 'display: none; color: forestgreen; font-weight: bolder',
				text: __('Success!', 'insecure-content-warning'),
			});
			const $error = jQuery('<span>', {
				class: 'error js-icw-error',
				style: 'display: none; color: #950e0d; font-weight: bolder',
				text: __(
					'Unable to find https:// equivalent. Please replace manually.',
					'insecure-content-warning'
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
		const $p = jQuery('<p>');
		const $label = jQuery('<label>', {
			for: 'icw-force-checkbox',
			text: __(
				'Publish with insecure assets',
				'insecure-content-warning'
			),
		});
		const $input = jQuery('<input>', {
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
		jQuery('.js-icw-error').remove();
	}
};

export default checkContent;
