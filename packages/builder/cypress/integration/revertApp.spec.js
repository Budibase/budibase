import filterTests from "../support/filterTests"
const interact = require('../support/interact')

filterTests(['smoke', 'all'], () => {
    context("Revert apps", () => {
        before(() => {
        cy.login()
        cy.createTestApp()
        })
        
        it("should try to revert an unpublished app", () => {
            // Click revert icon
            cy.get(interact.TOP_RIGHT_NAV).within(() => {
                cy.get(interact.AREA_LABEL_REVERT).click({ force: true })
            })
            cy.get(interact.SPECTRUM_MODAL).within(() => {
                // Enter app name before revert
                cy.get("input").type("Cypress Tests")
                cy.intercept('**/revert').as('revertApp')
                // Click Revert
                cy.get(interact.SPECTRUM_BUTTON).contains("Revert").click({ force: true })
                // Intercept Request after button click & apply assertions
                cy.wait("@revertApp")
                cy.get("@revertApp").its('response.body').should('have.property', 'message', "App has not yet been deployed")
                cy.get("@revertApp").its('response.body').should('have.property', 'status', 400)
            })
        })
        
        it("should revert a published app", () => {
            cy.navigateToFrontend()

            // Add initial component - Paragraph
            cy.searchAndAddComponent("Paragraph")
            // Publish app
            cy.get(interact.SPECTRUM_BUTTON).contains("Publish").click({ force: true })
            cy.get(interact.SPECTRUM_BUTTON_GROUP).within(() => {
                cy.get(interact.SPECTRUM_BUTTON).contains("Publish").click({ force: true })
            })
            cy.wait(1000) // Wait for next modal to finish loading
            cy.get(interact.SPECTRUM_BUTTON_GROUP, { timeout: 1000 }).within(() => {
                cy.get(interact.SPECTRUM_BUTTON).contains("Done").click({ force: true })
            })

            // Add second component - Button
            cy.searchAndAddComponent("Button")
            // Click Revert
            cy.get(interact.TOP_RIGHT_NAV).within(() => {
                cy.get(interact.AREA_LABEL_REVERT).click({ force: true })
            })
            cy.get(interact.SPECTRUM_DIALOG_GRID).within(() => {
                // Click Revert
                cy.get(interact.SPECTRUM_BUTTON).contains("Revert").click({ force: true })
                cy.wait(2000) // Wait for app to finish reverting
            })
            // Confirm Paragraph component is still visible
            cy.get(interact.ROOT, { timeout: 1000 }).contains("New Paragraph")
            // Confirm Button component is not visible
            cy.get(interact.ROOT, { timeout: 1000 }).should("not.have.text", "New Button")
        })
        
        it("should enter incorrect app name when reverting", () => {
            // Click Revert
            cy.get(interact.TOP_RIGHT_NAV, { timeout: 1000 }).within(() => {
                cy.get(interact.AREA_LABEL_REVERT).click({ force: true })
            })
            // Enter incorrect app name
            cy.get(interact.SPECTRUM_DIALOG_GRID).within(() => {
                cy.get("input").type("Cypress Tests")
                // Revert button within modal should be disabled
                cy.get(interact.SPECTRUM_BUTTON).eq(1).should('be.disabled')
            })
        })
    })
})
