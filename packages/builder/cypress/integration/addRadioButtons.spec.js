import filterTests from "../support/filterTests"
const interact = require('../support/interact')

filterTests(['all'], () => {
    xcontext("Add Radio Buttons", () => {
        before(() => {
        cy.login()
        cy.createTestApp()
        })

    it("should add Radio Buttons options picker on form, add data, and confirm", () => {
        cy.navigateToFrontend()
        cy.searchAndAddComponent("Form")
        cy.searchAndAddComponent("Options Picker").then((componentId) => {
        // Provide field setting
        cy.get(interact.DATASOURCE_FIELD_CONTROL).type("1")
        // Open dropdown and select Radio buttons
        cy.get(interact.OPTION_TYPE_PROP_CONTROL).click().then(() => {
            cy.get(interact.SPECTRUM_POPOVER).contains('Radio buttons')
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
            cy.get(interact.OPTION_SOURCE_PROP_CONROL).click().then(() => {
                cy.get(interact.SPECTRUM_POPOVER).contains('Custom')
                .click()
                .wait(1000)
            })
            cy.addCustomSourceOptions(totalRadioButtons)
        }

    after(() => {
        cy.deleteAllApps()
        })
    })
})
