const { randomName } = require("../support/functions");

describe("Block Editor Tests", () => {
	before(() => {
		cy.login();
		cy.deactivatePlugin("classic-editor");
	});

	beforeEach(() => {
		cy.login();
	});

	it("Should display warning, able to use force publish checkbox", () => {
		const title = "Insecure content " + randomName();
		cy.createPost({
			title: title,
			beforeSave: () => {
				cy.insertInsecureBlock(() => {
					cy.openDocumentSettingsSidebar("Post");
					cy.clickPublish();

					cy.get(".components-notice").should(
						"contain.text",
						"1 insecure element found"
					);

					cy.get(".components-checkbox-control__label")
						.contains("Publish with insecure assets")
						.click();
				} );

			},
		});
	});

	it("Should detect multiple elements", () => {
		const title = "Insecure content " + randomName();
		cy.createPost({
			title: title,
			beforeSave: () => {
				cy.insertInsecureBlock(() => {
					cy.insertBlock("core/html").then((id) => {
						cy.getBlockEditor().find(`#${id}`).then(($block) => {
							const $button = $block.find('.components-placeholder__fieldset button');
							// WP 7.0+ uses a modal with a button, older versions use a textarea directly
							if ($button.length > 0) {
								cy.wrap($button).click();
								cy.get('.block-editor-plain-text')
									.type(randomName());
								cy.get('.block-library-html__modal-footer button.is-primary').click();
							} else {
								// Older WordPress versions - textarea is directly available
								cy.wrap($block.find('textarea')).type(randomName());
							}
						});
					});
					cy.insertInsecureBlock(() => {
						cy.openDocumentSettingsSidebar("Post");
						cy.clickPublish();

						cy.get(".components-notice").should(
							"contain.text",
							"2 insecure elements found"
						);

						cy.get(".components-checkbox-control__label")
							.contains("Publish with insecure assets")
							.click();
					} );
				} );
			},
		});
	});

	it("Should be able to fix manually", () => {
		const title = "Insecure content " + randomName();
		cy.createPost({
			title: title,
			beforeSave: () => {
				cy.insertInsecureBlock((id) => {
					// Try to publish insecure blocks first.
					cy.openDocumentSettingsSidebar("Post");
					cy.clickPublish();

					cy.get(".components-notice").should(
						"contain.text",
						"1 insecure element found"
					);

					// Change http to https.
					cy.getBlockEditor().find(`#${id} textarea`)
						.invoke("val")
						.invoke("replaceAll", "http://", "https://")
						.then((insecure) => {
							cy.getBlockEditor().find(`#${id} textarea`).clear().type(insecure);
						});
				});
			},
		});
	});

	it("Should display warning for HTML block, able to use force publish checkbox", () => {
		const title = "Insecure content " + randomName();
		cy.createPost({
			title: title,
			beforeSave: () => {
				cy.insertInsecureHTMLBlock( () => {
					cy.openDocumentSettingsSidebar( 'Post' );
					cy.clickPublish();

					cy.get( '.components-notice' ).should(
						'contain.text',
						'1 insecure element found'
					);

					cy.get( '.components-checkbox-control__label' )
						.contains( 'Publish with insecure assets' )
						.click();
				} );
			},
		});
	});
});
