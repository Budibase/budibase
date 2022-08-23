import filterTests from "../../support/filterTests"
const interact = require('../../support/interact')

filterTests(["smoke", "all"], () => {
  context("Account Portals", () => {
    
    const bbUserEmail = "bbuser@test.com"
    
    before(() => {
      cy.login()
      cy.deleteApp("Cypress Tests")
      cy.createApp("Cypress Tests", false)
      
      // Create new user
      cy.wait(500)
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000})
      cy.createUser(bbUserEmail)
      cy.contains("bbuser").click()
      cy.wait(500)

      // Reset password
      cy.get(".title").within(() => {
        cy.get(interact.SPECTRUM_ICON).click({ force: true })
      })
      cy.get(interact.SPECTRUM_MENU).within(() => {
        cy.get(interact.SPECTRUM_MENU_ITEM).contains("Force password reset").click({ force: true })
      })
      
      cy.get(interact.SPECTRUM_DIALOG_GRID)
      .find(interact.SPECTRUM_TEXTFIELD_INPUT).invoke('val').as('pwd')

      cy.get(interact.SPECTRUM_BUTTON).contains("Reset password").click({ force: true })
      
      // Login as new user and set password
      cy.logOut()
      cy.get('@pwd').then((pwd) => {
        cy.login(bbUserEmail, pwd)
      })
      
      for (let i = 0; i < 2; i++) {
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT).eq(i).type("test")
      }
      cy.get(interact.SPECTRUM_BUTTON).contains("Reset your password").click({ force: true })
      //cy.logoutNoAppGrid()
    })

    it("should verify Standard Portal", () => {
      // Development access should be disabled (Admin access is already disabled)
      cy.login()
      cy.setUserRole("bbuser", "App User")
      bbUserLogin()

      // Verify Standard Portal
      cy.get(interact.SPECTRUM_SIDENAV).should('not.exist') // No config sections
      cy.get(interact.CREATE_APP_BUTTON).should('not.exist') // No create app button
      cy.get(".app").should('not.exist') // No apps -> no roles assigned to user
      cy.get(interact.CONTAINER).should('contain', bbUserEmail) // Message containing users email

      cy.logoutNoAppGrid()
    })
    
    it("should verify Admin Portal", () => {
        cy.login()
        // Configure user role
        cy.setUserRole("bbuser", "Admin")
        bbUserLogin()

        // Verify available options for Admin portal
        cy.get(interact.SPECTRUM_SIDENAV)
        .should('contain', 'Apps')
        //.and('contain', 'Usage')
        .and('contain', 'Users')
        .and('contain', 'Auth')
        .and('contain', 'Email')
        .and('contain', 'Organisation')
        .and('contain', 'Theming')
        .and('contain', 'Update')
        //.and('contain', 'Upgrade')

        cy.logOut()
    })

    it("should verify Development Portal", () => {
      // Only Development access should be enabled
      cy.login()
      cy.setUserRole("bbuser", "Developer")
      bbUserLogin()

      // Verify available options for Admin portal
      cy.get(interact.SPECTRUM_SIDENAV)
        .should('contain', 'Apps')
        //.and('contain', 'Usage')
        .and('not.contain', 'Users')
        .and('not.contain', 'Auth')
        .and('not.contain', 'Email')
        .and('not.contain', 'Organisation')
        .and('contain', 'Theming')
        .and('not.contain', 'Update')
        .and('not.contain', 'Upgrade')

        cy.logOut()
    })

    const bbUserLogin = () => {
      // Login as bbuser
      cy.logOut()
      cy.login(bbUserEmail, "test")
    }

    after(() => {
      cy.login()
      // Delete BB user
      cy.deleteUser(bbUserEmail)
    })
  })
})
