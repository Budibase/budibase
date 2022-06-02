import filterTests from "../support/filterTests"
const interact = require('../support/interact')

filterTests(['all'], () => {
  context("Change Application Icon and Colour", () => {
      before(() => {
        cy.login()
      })

      it("should change the icon and colour for an application", () => {
          // Search for test application
          cy.applicationInAppTable("Cypress Tests")
          cy.get(".appTable")
            .within(() => {
              cy.get(interact.APP_ROW_ACTION).eq(0).click()
            })
          cy.get(interact.SPECTRUM_MENU).contains("Edit icon").click()
          // Select random icon
          cy.get(interact.GRID).within(() => {
              cy.get(interact.ICON_ITEM).eq(Math.floor(Math.random() * 23) + 1).click()
          })
          // Select random colour
          cy.get(interact.FILL).click()
          cy.get(interact.COLOURSS).within(() => {
              cy.get(interact.COLOUR).eq(Math.floor(Math.random() * 33) + 1).click()
          })
          cy.intercept('**/applications/**').as('iconChange')
          cy.get(interact.SPECTRUM_BUTTON).contains("Save").click({ force: true })
          cy.wait("@iconChange")
          cy.get("@iconChange").its('response.statusCode')
          .should('eq', 200)
          cy.wait(1000)
          // Confirm icon has changed from default
          // Confirm colour has been applied - There is no default colour
          cy.get(".appTable")
            .within(() => {
              cy.get(interact.AREA_LABEL).eq(0).children()
              .should('have.attr', 'xlink:href').and('not.contain', '#spectrum-icon-18-Apps')
              cy.get(interact.TITLE).children().children()
              .should('have.attr', 'style').and('contains', 'color')
            })
          cy.deleteAllApps()
      })
  })
})
