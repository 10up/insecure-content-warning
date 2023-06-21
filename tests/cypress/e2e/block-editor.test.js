const { randomName } = require("../support/functions");

describe("Block Editor Tests", () => {
	before(() => {
		cy.login();
		cy.deactivatePlugin("classic-editor");
	});

	it("Should display warning, able to use force publish checkbox", () => {
		const title = "Insecure content " + randomName();
		cy.createPost({
			title: title,
			beforeSave: () => {
				cy.insertInsecureBlock();

				cy.openDocumentSettingsSidebar("Post");
				cy.clickPublish();

				cy.get(".components-notice").should(
					"contain.text",
					"1 insecure element found"
				);

				cy.get(".components-checkbox-control__label")
					.contains("Publish with insecure assets")
					.click();
			},
		});
	});

	it("Should detect multiple elements", () => {
		const title = "Insecure content " + randomName();
		cy.createPost({
			title: title,
			beforeSave: () => {
				cy.insertInsecureBlock();
				cy.insertBlock("core/paragraph").then((id) => {
					cy.get(`#${id}`).click().type(randomName());
				});
				cy.insertInsecureBlock();

				cy.openDocumentSettingsSidebar("Post");
				cy.clickPublish();

				cy.get(".components-notice").should(
					"contain.text",
					"2 insecure elements found"
				);

				cy.get(".components-checkbox-control__label")
					.contains("Publish with insecure assets")
					.click();
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
					cy.get(`#${id} textarea`)
						.invoke("val")
						.invoke("replaceAll", "http://", "https://")
						.then((insecure) => {
							cy.get(`#${id} textarea`).clear().type(insecure);
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
				cy.insertInsecureHTMLBlock();

				cy.openDocumentSettingsSidebar("Post");
				cy.clickPublish();

				cy.get(".components-notice").should(
					"contain.text",
					"1 insecure element found"
				);

				cy.get(".components-checkbox-control__label")
					.contains("Publish with insecure assets")
					.click();
			},
		});
	});
});
