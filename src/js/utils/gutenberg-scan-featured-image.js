const { select } = wp.data;

/**
 * Returns all insecure URLs from ghe featured image.
 *
 * @param {number} id Attachmet ID.
 * @return Array
 */
export function gutenberg_scan_featured_images(id = 0) {
	if (id === 0) {
		return [];
	}

	const { getMedia } = select('core');

	// Return the media object by attachment ID.
	const featuredImageObj = getMedia(id);

	/**
	 * Array to hold source URLs of all sizes
	 * for a given attachment.
	 */
	const sourceUrls = [];

	// The main source URL.
	if (featuredImageObj.source_url) {
		sourceUrls.push(featuredImageObj.source_url);
	}

	/**
	 * Iterates over source URL for each image size
	 * and adds it to the `sourceUrls` array.
	 * We do this because the image on the front end can have
	 * `srcset` attribute.
	 */
	if (featuredImageObj.media_details) {
		Object.keys(featuredImageObj.media_details.sizes).forEach((item) => {
			const sourceUrl = featuredImageObj.media_details.sizes[item].source_url;
			if (sourceUrl) {
				sourceUrls.push(sourceUrl);
			}
		});
	}

	/**
	 * Filters all the `http://` URLs from the `sourceUrls`.
	 */
	const insecureUrls = sourceUrls.filter((item) => {
		return item.indexOf('https://') === -1;
	});

	return insecureUrls;
}
