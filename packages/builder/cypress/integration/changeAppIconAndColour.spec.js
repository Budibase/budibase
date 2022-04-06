import filterTests from "../support/filterTests"

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
              cy.get(".spectrum-Icon").eq(1).click()
            })
          cy.get(".spectrum-Menu").contains("Edit icon").click()
          // Select random icon
          cy.get(".grid").within(() => {
              cy.get(".icon-item").eq(Math.floor(Math.random() * 23) + 1).click()
          })
          // Select random colour
          cy.get(".fill").click()
          cy.get(".colors").within(() => {
              cy.get(".color").eq(Math.floor(Math.random() * 33) + 1).click()
          })
          cy.intercept('**/applications/**').as('iconChange')
          cy.get(".spectrum-Button").contains("Save").click({ force: true })
          cy.wait("@iconChange")
          cy.get("@iconChange").its('response.statusCode')
          .should('eq', 200)
          cy.wait(1000)
          // Confirm icon has changed from default
          // Confirm colour has been applied - There is no default colour
          cy.get(".appTable")
            .within(() => {
              cy.get('[aria-label]').eq(0).children()
              .should('have.attr', 'xlink:href').and('not.contain', '#spectrum-icon-18-Apps')
              cy.get(".title").children().children()
              .should('have.attr', 'style').and('contains', 'color')
            })
      })
  })
})
