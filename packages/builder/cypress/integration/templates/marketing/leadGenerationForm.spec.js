import filterTests from "../../../support/filterTests"

filterTests(["all"], () => {
  context("Lead Generation Form Template Functionality", () => {
    const templateName = "Lead Generation Form"
    const templateNameParsed = templateName.toLowerCase().replace(/\s+/g, '-')
    
    before(() => {
        cy.login()
        cy.deleteApp(templateName)
        // Template navigation
        cy.visit(`${Cypress.config().baseUrl}/builder/portal/apps/templates`, {
            onBeforeLoad(win) {
                cy.stub(win, 'open')
            }
        })
        cy.wait(2000)
        })

    it("should create and publish app with Lead Generation Form template", () => {
        // Select Lead Generation Form template
        cy.get(".template-thumbnail-text")
            .contains(templateName).parentsUntil(".template-grid").within(() => {
                cy.get(".spectrum-Button").contains("Use template").click({ force: true })
            })

        // Confirm URL matches template name
        const appUrl = cy.get(".app-server")
        appUrl.invoke('text').then(appUrlText => {
            expect(appUrlText).to.equal(`${Cypress.config().baseUrl}/app/` + templateNameParsed)
        })

        // Create App
        cy.get(".spectrum-Dialog-grid").within(() => {
            cy.get(".spectrum-Button").contains("Create app").click({ force: true })
        })

        // Publish App & Verify it opened
        cy.wait(2000) // Wait for app to generate
        cy.publishApp(true)
        cy.window().its('open').should('be.calledOnce')
        })
    })
})
