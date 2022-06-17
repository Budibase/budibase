import filterTests from "../../support/filterTests"
const interact = require('../../support/interact')

filterTests(["smoke", "all"], () => {
  context("Account Portal", () => {
    before(() => {
      cy.login()
      cy.deleteApp("Cypress Tests")
      cy.createApp("Cypress Tests")
      
      // Create new user
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 1000})
      cy.createUser("bbuser@test.com")
      cy.contains("bbuser").click()

      // Reset password
      cy.get(interact.REGENERATE, { timeout: 500 }).click({ force: true })
      const newPwd = cy.get(interact.SPECTRUM_TEXTFIELD_INPUT).its('value')
      cy.get(interact.SPECTRUM_BUTTON).contains("Reset password").click({ force: true })

      // Login as new user and set password
      cy.logOut()
      cy.login("bbuser@test.com", newPwd)
      for (let i = 0; i < 2; i++) {
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT).eq(i).type("test")
      }
      cy.get(interact.SPECTRUM_BUTTON).contains("Reset your password").click({ force: true })
      cy.logOut()
    })
    
    it("should verify Admin Portal", () => {
        cy.login()
        // Enable Development & Administration access
        for (let i = 4; i < 6; i++) {
            cy.get(interact.FIELD).eq(i).within(() => {
              cy.get(interact.SPECTRUM_SWITCH_INPUT).click({ force: true })
              cy.get(interact.SPECTRUM_SWITCH_INPUT).should('be.enabled')
            })
        }
        // Login as new user
        cy.logOut()
        cy.login("bbuser@test.com", "test")

        // Enter developer mode
        cy.get(".user-dropdown .avatar > .icon", { timeout: 2000 }).click({ force: true })
        cy.get(".spectrum-Popover[data-cy='user-menu']").within(() => {
            cy.get(".spectrum-Menu-itemLabel").contains("Open developer mode").click({ force: true })
          })
        cy.get(".spectrum-SideNav")
        .should('contain', 'Apps')
        .and('contain', 'Users')
        .and('contain', 'Auth')
        .and('contain', 'Email')
        .and('contain', 'Organisation')
        .and('contain', 'Theming')
        .and('contain', 'Update')
    })
  })
})
