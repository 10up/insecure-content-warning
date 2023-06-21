import { scanElements } from './scan-elements';

import { select } from '@wordpress/data';

export const gutenbergScan = () => {
	const content = select('core/editor').getEditedPostAttribute('content');
	const $elements = jQuery.parseHTML(content);
	const scanResults = scanElements([
		...jQuery($elements).toArray(),
		...jQuery($elements).find('*').toArray(),
	]);

	return scanResults;
};
