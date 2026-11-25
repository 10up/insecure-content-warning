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
import type { Admin } from '@wordpress/e2e-test-utils-playwright';
import type { Page } from '@playwright/test';

/**
 * Opens a new classic editor post with the given title and switches to the
 * Code tab.
 *
 * @param admin E2E admin utils.
 * @param page  Playwright page.
 * @param title Post title.
 */
async function startPost( admin: Admin, page: Page, title: string ) {
	await admin.visitAdminPage( 'post-new.php' );
	await page.locator( '#title' ).fill( title );
	// Blurring the title autosaves the new post, which disables Publish
	// until it finishes.
	await page.locator( '#title' ).blur();
	await expect( page.locator( '#sample-permalink' ) ).toBeVisible();
	await page.locator( '#content-html' ).click();
}

/**
 * Records every submission of the post form from now on.
 *
 * A form submission starts during the click that triggers it, so the list is
 * complete once the click has returned.
 *
 * @param page Playwright page.
 * @return The recorded submission URLs.
 */
function recordSubmissions( page: Page ) {
	const submissions: string[] = [];
	page.on( 'request', ( request ) => {
		if (
			request.method() === 'POST' &&
			new URL( request.url() ).pathname.endsWith( '/wp-admin/post.php' )
		) {
			submissions.push( request.url() );
		}
	} );
	return submissions;
}

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

		await startPost( admin, page, title );
		await page
			.locator( '#content' )
			.fill(
				'Some content<img src="http://example.com/insecure-image.jpg" />' +
					'More content<img src="http://example.com/insecure-image.jpg" />'
			);
		await page.locator( '#content-tmce' ).click();

		const submissions = recordSubmissions( page );
		await expect( publishButton ).not.toHaveClass( /\bdisabled\b/ );
		await publishButton.click();
		await expect( page.locator( '.js-icw-error' ).first() ).toContainText(
			'2 insecure elements found.'
		);
		await expect( publishButton ).toHaveClass( /\bdisabled\b/ );
		// The click did not submit the post.
		expect( submissions ).toHaveLength( 0 );

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

	test( 'warns about an insecure image entered in the Code tab', async ( {
		admin,
		page,
	} ) => {
		const publishButton = page.locator( '#publish' );

		await startPost( admin, page, 'Insecure code tab content' );
		await page
			.locator( '#content' )
			.fill( '<img src="http://example.com/insecure-image.jpg" />' );

		const submissions = recordSubmissions( page );
		await expect( publishButton ).not.toHaveClass( /\bdisabled\b/ );
		await publishButton.click();
		await expect( page.locator( '.js-icw-error' ).first() ).toContainText(
			'1 insecure element found.'
		);
		expect( submissions ).toHaveLength( 0 );
	} );
} );
