import { get } from 'underscore';

const $ = jQuery;

/**
 * Find element on page
 *
 * @param {string} url URL to search in element attributes
 * @param {Array} $searchIn List of elements to search in (default empty array -- search in body)
 * @return {Array} Elements matching the URL
 */
const findElements = (url = '', $searchIn = []) => {
	const $visualEditorWrap = $(document.getElementById('wp-content-wrap'));

	let $from;

	if ($searchIn.length) {
		$from = $($searchIn);
	} else if (
		$visualEditorWrap.hasClass('tmce-active') ||
		$visualEditorWrap.hasClass('tinymce-active')
	) {
		$from = $('#content_ifr').contents().find('*');
	} else {
		$from = $('<div>')
			.append($.parseHTML($('#content').val()))
			.find('*');
	}

	const $found = $from.filter((index, el) => {
		if (get(el, 'dataset.mceObject') === 'object') {
			if (el.dataset.mcePData && el.dataset.mcePData.substr(0, url.length) === url) {
				return true;
			}
		}
		if (el.src && el.src.substr(0, url.length) === url) {
			return true;
		}
		if (el.srcset && el.srcset.substr(0, url.length) === url) {
			return true;
		}
		if (
			el.nodeName.toLowerCase() === 'object' &&
			el.data &&
			el.data.substr(0, url.length) === url
		) {
			return true;
		}
		return false;
	});

	return $found;
};

export default findElements;