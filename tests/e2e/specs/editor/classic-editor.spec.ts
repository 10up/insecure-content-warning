/**
 * Insecure content warning in the classic editor.
 *
 * Publishing is held back with a warning listing the insecure assets until the
 * author ticks "Publish with insecure assets".
 */

/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Classic editor', () => {
	test.beforeAll( async ( { requestUtils } ) => {
		await requestUtils.activatePlugin( 'classic-editor' );
	} );

	test.afterAll( async ( { requestUtils } ) => {
		await requestUtils.deactivatePlugin( 'classic-editor' );
		await requestUtils.deleteAllPosts();
	} );

	test( 'warns about insecure images and publishes once the author confirms', async ( {
		admin,
		page,
		requestUtils,
	} ) => {
		const title = 'Insecure classic content';
		const publishButton = page.locator( '#publish' );

		await admin.visitAdminPage( 'post-new.php' );
		await page.locator( '#title' ).fill( title );
		// Blurring the title autosaves the new post, which disables Publish
		// until it finishes.
		await page.locator( '#title' ).blur();
		await expect( page.locator( '#sample-permalink' ) ).toBeVisible();

		await page.locator( '#content-html' ).click();
		await page
			.locator( '#content' )
			.fill(
				'Some content<img src="http://example.com/insecure-image.jpg" />' +
					'More content<img src="http://example.com/insecure-image.jpg" />'
			);
		await page.locator( '#content-tmce' ).click();

		await expect( publishButton ).not.toHaveClass( /\bdisabled\b/ );
		await publishButton.click();
		await expect( page.locator( '.js-icw-error' ).first() ).toContainText(
			'2 insecure elements found.'
		);
		await expect( publishButton ).toHaveClass( /\bdisabled\b/ );

		await page.getByLabel( 'Publish with insecure assets' ).check();
		await expect( publishButton ).not.toHaveClass( /\bdisabled\b/ );
		await publishButton.click();
		await expect( page.getByText( 'Post published.' ) ).toBeVisible();

		const posts = await requestUtils.rest( {
			path: '/wp/v2/posts',
			params: { search: title, status: 'publish' },
		} );
		expect( posts ).toHaveLength( 1 );
	} );
} );
