/**
 * Bulk fixer on Tools > Insecure Content Warning.
 *
 * The screen counts the posts to check, then asks the server to fix them one
 * batch at a time. Every post has to be reached, however the posts split into
 * batches.
 */

/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe( 'Bulk fixer', () => {
	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();
	} );

	test( 'fixes every post when the posts span several batches', async ( {
		admin,
		page,
		requestUtils,
	} ) => {
		// The E2E helper plugin answers 200 for every https://example.com URL.
		const posts = [];
		for ( const name of [ 'first', 'second', 'third' ] ) {
			posts.push(
				await requestUtils.createPost( {
					title: `Bulk fix ${ name }`,
					content: `<!-- wp:html --><img src="http://example.com/${ name }.jpg" /><!-- /wp:html -->`,
					status: 'publish',
				} )
			);
		}

		await admin.visitAdminPage(
			'tools.php',
			'page=insecure-content-warning'
		);
		await page.getByLabel( 'Items to scan at a time' ).fill( '2' );
		await page.locator( '#icw-dry-run' ).uncheck();
		await page.getByRole( 'link', { name: 'Fix', exact: true } ).click();

		await expect( page.locator( '#icw-fix-log' ) ).toContainText( '100%' );

		for ( const post of posts ) {
			const saved = await requestUtils.rest( {
				path: `/wp/v2/posts/${ post.id }`,
				params: { context: 'edit' },
			} );
			expect( saved.content.raw ).toContain( 'src="https://example.com/' );
			expect( saved.content.raw ).not.toContain( 'src="http://' );
		}
	} );
} );
