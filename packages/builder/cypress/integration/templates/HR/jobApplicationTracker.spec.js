import filterTests from "../../../support/filterTests"

filterTests(["all"], () => {
  context("Job Application Functionality", () => {
    const templateName = "Job Application Tracker"
    const templateNameParsed = templateName.toLowerCase().replace(/\s+/g, '-')
    
    before(() => {
        cy.login()
        cy.deleteApp(templateName)
        cy.visit(`${Cypress.config().baseUrl}/builder`, {
            onBeforeLoad(win) {
                cy.stub(win, 'open')
            }
        })
        cy.wait(2000)

        // Template navigation
        cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
        .its("body")
        .then(val => {
            if (val.length > 0) {
            cy.get(".spectrum-Button").contains("Templates").click({force: true})
            }
        })
        })

    it("should create and publish app with Job Application Tracker template", () => {
        // Select Job Application Tracker template
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

        // Publish App
        cy.wait(2000) // Wait for app to generate
        cy.get(".toprightnav").contains("Publish").click({ force: true })
        cy.get(".spectrum-Dialog-grid").within(() => {
            cy.get(".spectrum-Button").contains("Publish").click({ force: true })
        })

        // Verify Published app
        cy.wait(2000) // Wait for App to publish and modal to appear
        cy.get(".spectrum-Dialog-grid").within(() => {
            cy.get(".spectrum-Button").contains("View App").click({ force: true })
            cy.window().its('open').should('be.calledOnce')
        })
    })
    })
})
