/**
 * Insecure content warning in the block editor.
 *
 * Publishing a post that loads `http://` assets is held back with a notice
 * until the author fixes the assets or confirms "Publish with insecure assets".
 */

/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import type { Editor } from '@wordpress/e2e-test-utils-playwright';
import type { Page } from '@playwright/test';

const INSECURE_IMAGE = 'http://example.com/insecure-image.jpg';

/**
 * Whether the plugin's insecure content check is bound to the Publish button.
 *
 * Reads the button's click listeners with the DevTools `getEventListeners()`
 * command line API and looks for the one that locks saving under the plugin's
 * lock name.
 *
 * @param page Playwright page.
 */
async function isPublishCheckBound( page: Page ) {
	const client = await page.context().newCDPSession( page );
	try {
		const { result } = await client.send( 'Runtime.evaluate', {
			includeCommandLineAPI: true,
			returnByValue: true,
			expression: `( () => {
				const button = document.querySelector( '.editor-post-publish-button, .editor-post-publish-panel__toggle' );
				const listeners = button ? getEventListeners( button ).click || [] : [];
				return listeners.some( ( { listener } ) => String( listener ).includes( 'insecureContentWarning' ) );
			} )()`,
		} );
		return result.value === true;
	} finally {
		await client.detach();
	}
}

/**
 * Clicks the top bar Publish button, which runs the insecure content check.
 *
 * The plugin polls for the button every 500ms and binds the check once it
 * finds it, so a click right after the editor loads can beat it. Wait for the
 * check to be bound first.
 *
 * @param page Playwright page.
 */
async function clickPublish( page: Page ) {
	await expect.poll( () => isPublishCheckBound( page ) ).toBe( true );
	await page
		.getByRole( 'region', { name: 'Editor top bar' } )
		.getByRole( 'button', { name: 'Publish', exact: true } )
		.click();
}

/**
 * Locates the editor notice that reports the insecure elements.
 *
 * Matches the notice only, not the screen reader announcement of its text.
 * The notice markup differs between WordPress versions, so locate it by the
 * region it renders in.
 *
 * @param page Playwright page.
 * @param text Expected notice text.
 */
function insecureNotice( page: Page, text: string ) {
	return page
		.getByRole( 'region', { name: 'Editor content' } )
		.getByText( text, { exact: true } );
}

/**
 * Inserts an image block whose source is loaded over `http://`.
 *
 * @param editor E2E editor utils.
 */
async function insertInsecureImage( editor: Editor ) {
	await editor.insertBlock( {
		name: 'core/image',
		attributes: { url: INSECURE_IMAGE },
	} );
}

test.describe( 'Block editor', () => {
	test.afterEach( async ( { requestUtils } ) => {
		await requestUtils.deleteAllPosts();
	} );

	test( 'warns about an insecure image and publishes once the author confirms', async ( {
		admin,
		editor,
		page,
	} ) => {
		await admin.createNewPost( { title: 'Insecure image' } );
		await insertInsecureImage( editor );

		await clickPublish( page );
		await expect(
			insecureNotice( page, '1 insecure element found.' )
		).toBeVisible();

		await page
			.getByRole( 'checkbox', { name: 'Publish with insecure assets' } )
			.check();
		await editor.publishPost();
	} );

	test( 'counts every insecure element in the post', async ( {
		admin,
		editor,
		page,
	} ) => {
		await admin.createNewPost( { title: 'Several insecure images' } );
		await insertInsecureImage( editor );
		await editor.insertBlock( {
			name: 'core/html',
			attributes: { content: '<p>No assets here.</p>' },
		} );
		await editor.insertBlock( {
			name: 'core/image',
			attributes: { url: 'http://example.com/another-insecure-image.jpg' },
		} );

		await clickPublish( page );
		await expect(
			insecureNotice( page, '2 insecure elements found.' )
		).toBeVisible();

		await page
			.getByRole( 'checkbox', { name: 'Publish with insecure assets' } )
			.check();
		await editor.publishPost();
	} );

	test( 'publishes without confirmation once the insecure image is fixed', async ( {
		admin,
		editor,
		page,
	} ) => {
		await admin.createNewPost( { title: 'Fixed by hand' } );
		await insertInsecureImage( editor );

		await clickPublish( page );
		await expect(
			insecureNotice( page, '1 insecure element found.' )
		).toBeVisible();

		// Switch the image to its https:// URL, as an author would by hand.
		await page.evaluate( ( secureUrl ) => {
			const { select, dispatch } = ( window as any ).wp.data;
			const [ image ] = select( 'core/block-editor' ).getBlocks();
			dispatch( 'core/block-editor' ).updateBlockAttributes(
				image.clientId,
				{ url: secureUrl }
			);
		}, INSECURE_IMAGE.replace( 'http://', 'https://' ) );

		await editor.publishPost();
		await expect(
			insecureNotice( page, '1 insecure element found.' )
		).toBeHidden();
	} );

	test( 'warns about an insecure asset in a Custom HTML block and publishes once the author confirms', async ( {
		admin,
		editor,
		page,
	} ) => {
		await admin.createNewPost( { title: 'Insecure HTML' } );
		await editor.insertBlock( {
			name: 'core/html',
			attributes: { content: `<img src="${ INSECURE_IMAGE }" />` },
		} );

		await clickPublish( page );
		await expect(
			insecureNotice( page, '1 insecure element found.' )
		).toBeVisible();

		await page
			.getByRole( 'checkbox', { name: 'Publish with insecure assets' } )
			.check();
		await editor.publishPost();
	} );
} );
