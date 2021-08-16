const featuredImage = wp.media.featuredImage.frame();

/**
 * Fires when the featured image is set
 * in classic editor.
 */
featuredImage.on('select', function () {
	/**
	 * We save the featured image in a global window object.
	 * This object will be created only when the featured image
	 * is set and will only reset if the featured image is changed.
	 */
	window.tenup_icw_imageObject = featuredImage.state().get('selection').first().toJSON();
});

/**
 * Returns an array of featured image insecure URLs.
 *
 * @return Array
 */
export function classic_scan_featured_image() {
	const sourceUrls = [];
	const featuredImageObj = window.tenup_icw_imageObject;

	if (featuredImageObj.url) {
		sourceUrls.push(featuredImageObj.url);
	}

	/**
	 * Iterates over source URL for each image size
	 * and adds it to the `sourceUrls` array.
	 * We do this because the image on the front end can have
	 * `srcset` attribute.
	 */
	if (featuredImageObj.sizes) {
		Object.keys(featuredImageObj.sizes).forEach((item) => {
			const { url } = featuredImageObj.sizes[item];
			if (url) {
				sourceUrls.push(url);
			}
		});
	}

	if (sourceUrls.length === 0) {
		return sourceUrls;
	}

	/**
	 * Filters all the `http://` URLs from the `sourceUrls`.
	 */
	const insecureUrls = sourceUrls.filter((item) => {
		return item.indexOf('https://') === -1;
	});

	return insecureUrls;
}
