import { each, get } from 'underscore';

export const scanElements = ($elements) => {
	const insecureElementURLs = [];
	let insecure = 0;

	each($elements, (el) => {
		// Handle object elements that have been converted for the classic editor
		if (get(el, 'dataset.mceObject') === 'object') {
			if (
				el.dataset.mcePData &&
				el.dataset.mcePData.substr(0, 7) === 'http://'
			) {
				insecure += 1;

				// remove query parameters for display.
				const url = el.dataset.mcePData.split('?')[0];
				insecureElementURLs.push(url);
			}

			return;
		}

		// Handle elements with a src attribute, like img
		if (el.src && el.src.substr(0, 8) !== 'https://') {
			insecure += 1;

			// remove query parameters for display.
			const url = el.src.split('?')[0];
			insecureElementURLs.push(url);
		}

		// Handle elements with a srcset attribute, like img or source
		if (el.srcset && el.srcset.substr(0, 8) !== 'https://') {
			insecure += 1;

			// remove query parameters for display.
			const url = el.srcset.split('?')[0];
			insecureElementURLs.push(url);
		}

		// Handle object elements with a data attribute
		if (
			el.nodeName.toLowerCase() === 'object' &&
			el.data &&
			el.data.substr(0, 7) === 'http://'
		) {
			insecure += 1;

			// remove query parameters for display.
			const url = el.data.split('?')[0];
			insecureElementURLs.push(url);
		}
	});

	return {
		insecureElementURLs,
		insecure,
	};
};
