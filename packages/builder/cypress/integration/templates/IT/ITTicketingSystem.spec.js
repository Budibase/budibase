import filterTests from "../../../support/filterTests"

filterTests(["all"], () => {
  context("IT Ticketing System Template Functionality", () => {
    const templateName = "IT Ticketing System"
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

    it("should create and publish app with IT Ticketing System template", () => {
        // Select IT Ticketing System template
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

    xit("should filter tickets by status", () => {
        // Visit published app
        cy.visit(`${Cypress.config().baseUrl}/app/` + templateNameParsed)
        cy.wait(1000)

        // Tickets section
        cy.get(".links").contains("Tickets").click({ force: true })
        cy.wait(1000)

        // Filter by stage - Confirm table updates
        cy.get(".spectrum-Picker").contains("Filter by status").click({ force: true })
        cy.get(".spectrum-Menu").find('li').its('length').then(len => {
            for (let i = 1; i < len; i++) {
                cy.get(".spectrum-Menu-item").eq(i).click()
                const stage = cy.get(".spectrum-Picker-label")
                stage.invoke('text').then(stageText => {
                    if (stageText == "In progress" || stageText == "On hold" || stageText == "Triaged") {
                        cy.get(".placeholder").should('contain', 'No rows found')
                    }
                    else {
                        cy.get(".spectrum-Table-row").should('contain', stageText)
                    }
                    cy.get(".spectrum-Picker").contains(stageText).click({ force: true })
                })
            }
        })
    })
    })
})
