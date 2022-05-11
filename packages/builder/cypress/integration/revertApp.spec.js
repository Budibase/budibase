import filterTests from "../support/filterTests"

filterTests(['smoke', 'all'], () => {
    context("Revert apps", () => {
        before(() => {
        cy.login()
        cy.createTestApp()
        })
        
        it("should try to revert an unpublished app", () => {
            // Click revert icon
            cy.get(".toprightnav").within(() => {
                cy.get("[aria-label='Revert']").click({ force: true })
            })
            cy.get(".spectrum-Modal").within(() => {
                // Enter app name before revert
                cy.get("input").type("Cypress Tests")
                cy.intercept('**/revert').as('revertApp')
                // Click Revert
                cy.get(".spectrum-Button").contains("Revert").click({ force: true })
                // Intercept Request after button click & apply assertions
                cy.wait("@revertApp")
                cy.get("@revertApp").its('response.body').should('have.property', 'message', "App has not yet been deployed")
                cy.get("@revertApp").its('response.body').should('have.property', 'status', 400)
            })
        })
        
        it("should revert a published app", () => {
            cy.navigateToFrontend()

            // Add initial component - Paragraph
            cy.addComponent("Elements", "Paragraph")
            // Publish app
            cy.get(".spectrum-Button").contains("Publish").click({ force: true })
            cy.get(".spectrum-ButtonGroup").within(() => {
                cy.get(".spectrum-Button").contains("Publish").click({ force: true })
            })
            cy.wait(1000)
            cy.get(".spectrum-ButtonGroup").within(() => {
                cy.get(".spectrum-Button").contains("Done").click({ force: true })
            })

            // Add second component - Button
            cy.addComponent("Elements", "Button")
            // Click Revert
            cy.get(".toprightnav").within(() => {
                cy.get("[aria-label='Revert']").click({ force: true })
            })
            cy.get(".spectrum-Dialog-grid").within(() => {
                // Click Revert
                cy.get(".spectrum-Button").contains("Revert").click({ force: true })
                cy.wait(1000)
            })
            // Confirm Paragraph component is still visible
            cy.get(".root").contains("New Paragraph")
            // Confirm Button component is not visible
            cy.get(".root").should("not.have.text", "New Button")
            cy.wait(500)
        })
        
        it("should enter incorrect app name when reverting", () => {
            // Click Revert
            cy.get(".toprightnav").within(() => {
                cy.get("[aria-label='Revert']").click({ force: true })
            })
            // Enter incorrect app name
            cy.get(".spectrum-Dialog-grid").within(() => {
                cy.get("input").type("Cypress Tests")
                // Revert button within modal should be disabled
                cy.get(".spectrum-Button").eq(1).should('be.disabled')
            })
        })
    })
})
