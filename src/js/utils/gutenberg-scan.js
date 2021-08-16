import { scanElements } from './scan-elements';
import { gutenberg_scan_featured_images } from './gutenberg-scan-featured-image';

const { select } = wp.data;

export const gutenbergScan = () => {
	const content = select('core/editor').getEditedPostAttribute('content');
	const $elements = jQuery.parseHTML(content);
	const scanResults = scanElements(jQuery($elements).find('*').toArray());
	const featuredMediaId = select('core/editor').getEditedPostAttribute('featured_media');
	const featuredImageInsecureUrls = gutenberg_scan_featured_images(featuredMediaId);

	/**
	 * Calculate number of insecure URLs.
	 */
	scanResults.insecure += featuredImageInsecureUrls.length;

	/**
	 * Merge insecure URLs from different parts of the
	 * edit page.
	 */
	scanResults.insecureElementURLs = [
		...scanResults.insecureElementURLs,
		...featuredImageInsecureUrls,
	];

	return scanResults;
};
