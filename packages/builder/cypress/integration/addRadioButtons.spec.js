import filterTests from "../support/filterTests"

filterTests(['all'], () => {
    context("Add Radio Buttons", () => {
        before(() => {
        cy.login()
        cy.createTestApp()
        })

    it("should add Radio Buttons options picker on form, add data, and confirm", () => {
        cy.navigateToFrontend()
        cy.addComponent("Form", "Form")
        cy.addComponent("Form", "Options Picker").then((componentId) => {
            // Provide field setting
        cy.get(`[data-cy="field-prop-control"]`).type("1")
        // Open dropdown and select Radio buttons
        cy.get(`[data-cy="optionsType-prop-control"]`).click().then(() => {
            cy.get('.spectrum-Popover').contains('Radio buttons')
            .wait(500)
            .click()
            })
        const radioButtonsTotal = 3
        // Add values and confirm total
        addRadioButtonData(radioButtonsTotal)
        cy.getComponent(componentId).find('[type="radio"]')
        .should('have.length', radioButtonsTotal)
            })
        })
        
        const addRadioButtonData = (totalRadioButtons) => {
            cy.get(`[data-cy="optionsSource-prop-control"]`).click().then(() => {
                cy.get('.spectrum-Popover').contains('Custom')
                .wait(500)
                .click()
            })
            cy.addCustomSourceOptions(totalRadioButtons)
        }
    })
})
