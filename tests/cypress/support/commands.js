// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("clickPublish", () => {
	cy.get(".editor-post-publish-panel__toggle").click();
});

Cypress.Commands.add("editBlockAsHTML", (id) => {
	cy.get(`#${id}`).focus();

	// Open HTML editor.
	cy.get(
		'.block-editor-block-contextual-toolbar[aria-label="Block tools"]'
	).within(() => {
		cy.get(
			'.components-button[aria-label="Options"], .components-button[aria-label="More options"]'
		).click();
	});
	cy.get(".components-button").contains("Edit as HTML").click();
});

Cypress.Commands.add("insertInsecureBlock", (after) => {
	cy.insertBlock("core/image").then((id) => {
		cy.get(`#${id} .components-form-file-upload input[type=file]`).attachFile(
			"example.jpg"
		);

		// Wait for spinner to go away.
		cy.get(`#${id} .components-spinner`).should("not.exist");

		cy.editBlockAsHTML(id);

		// Change https to http.
		cy.get(`#${id} textarea`)
			.invoke("val")
			.invoke("replaceAll", "https://", "http://")
			.then((insecure) => {
				cy.get(`#${id} textarea`).clear().type(insecure);
			});

		if (after) {
			after(id);
		}
	});
});
