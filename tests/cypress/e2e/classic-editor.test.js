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
				cy.get("#content-html").click();
				cy.get("#content")
					.click()
					.type(
						"Some content" +
							'<img src="http://google.com/dummy1.jpg" />' +
							"More content" +
							'<img src="http://google.com/dummy1.jpg" />'
					);
				cy.get("#content-tmce").click();

				// 1st attempt to save post, should display error.
				cy.get("#publish").click();
				cy.get(".js-icw-error").should(
					"contain.text",
					"2 insecure elements found"
				);

				cy.get("#icw-force-checkbox").check();
				// continue with the regular workflow after exiting beforeSave()
			},
		});

		// Check the post has been saved.
		cy.visit("/wp-admin/edit.php");
		cy.get(".column-title").should("contain.text", title);
	});
});
