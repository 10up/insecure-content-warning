const { randomName } = require("../support/functions");

describe("Classic Editor Tests", () => {
	before(() => {
		cy.login();
		cy.activatePlugin("classic-editor");
	});

	it("Should display warning, able to use force publish checkbox", () => {
		const title = "Insecure content " + randomName();
		cy.classicCreatePost({
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
});
