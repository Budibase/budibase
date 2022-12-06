import filterTests from "../../support/filterTests"
const interact = require('../../support/interact')

filterTests(["smoke", "all"], () => {
  context("User Settings Menu", () => {
    
    before(() => {
      cy.login()
    })
    
    it("should update user information via user settings menu", () => {
        const fname = "test"
        const lname = "user"

        cy.visit(`${Cypress.config().baseUrl}/builder`)
        cy.updateUserInformation(fname, lname)

        // Go to user info and confirm name update
        cy.contains("Users").click()
        cy.contains("test@test.com").click()

        cy.get(interact.FIELD, { timeout: 1000 }).eq(1).within(() => {
            cy.get(interact.SPECTRUM_TEXTFIELD_INPUT).should('have.value', fname)
          })
        cy.get(interact.FIELD).eq(2).within(() => {
            cy.get(interact.SPECTRUM_TEXTFIELD_INPUT).should('have.value', lname)
          })
    })

    it("should allow copying of the users API key", () => {
        cy.get(".user-dropdown .avatar > .icon", { timeout: 2000 }).click({ force: true })
        cy.get(interact.SPECTRUM_MENU_ITEM).contains("View API key").click({ force: true })
        cy.get(interact.SPECTRUM_DIALOG_CONTENT).within(() => {
            cy.get(interact.SPECTRUM_ICON).click({force: true})
        })
        // There may be timing issues with this on the smoke build
        cy.wait(500)
        cy.get(".spectrum-Toast-content")
        .contains("URL copied to clipboard")
        .should("be.visible")
    })

    it("should allow API key regeneration", () => {
        // Get initial API key value
        cy.get(interact.SPECTRUM_DIALOG_CONTENT)
        .find(interact.SPECTRUM_TEXTFIELD_INPUT).invoke('val').as('keyOne')

        // Click re-generate key button
        cy.get("button").contains("Re-generate key").click({ force: true })

        // Verify API key was changed
        cy.get(interact.SPECTRUM_DIALOG_CONTENT).within(() => {
            cy.get('@keyOne').then((keyOne) => {
                cy.get(interact.SPECTRUM_TEXTFIELD_INPUT).invoke('val').should('not.eq', keyOne)
            })
        })
        cy.closeModal()
    })

    it("should update password", () => {
        // Access Update password modal
        cy.get(".user-dropdown .avatar > .icon", { timeout: 2000 }).click({ force: true })
        cy.get(interact.SPECTRUM_MENU_ITEM).contains("Update password").click({ force: true })

        // Enter new password and update
        cy.get(interact.SPECTRUM_DIALOG_GRID).within(() => {
            for (let i = 0; i < 2; i++) {
                // password set to 'newpwd'
                cy.get(interact.SPECTRUM_TEXTFIELD_INPUT).eq(i).type("newpwd")
              }
            cy.get("button").contains("Update password").click({ force: true })
        })

        // Logout & in with new password
        //cy.logOut()
        cy.login("test@test.com", "newpwd")
    })

    it("should open and close developer mode", () => {
        cy.get(".user-dropdown .avatar > .icon", { timeout: 2000 }).click({ force: true })
        
        // Close developer mode & verify
        cy.get(interact.SPECTRUM_MENU_ITEM).contains("Close developer mode").click({ force: true })
        cy.get(interact.SPECTRUM_SIDENAV).should('not.exist') // No config sections
        cy.get(interact.CREATE_APP_BUTTON).should('not.exist') // No create app button
        cy.get(".app").should('not.exist') // At least one app should be available

        // Open developer mode & verify
        cy.get(".avatar > .icon").click({ force: true })
        cy.get(interact.SPECTRUM_MENU_ITEM).contains("Open developer mode").click({ force: true })
        cy.get(interact.SPECTRUM_SIDENAV).should('exist') // config sections available
        cy.get(interact.CREATE_APP_BUTTON).should('exist') // create app button available
    })

    after(() => {
        // Change password back to original value
        cy.get(".user-dropdown .avatar > .icon", { timeout: 2000 }).click({ force: true })
        cy.get(interact.SPECTRUM_MENU_ITEM).contains("Update password").click({ force: true })
        cy.get(interact.SPECTRUM_DIALOG_GRID).within(() => {
            for (let i = 0; i < 2; i++) {
                cy.get(interact.SPECTRUM_TEXTFIELD_INPUT).eq(i).type("test")
              }
            cy.get("button").contains("Update password").click({ force: true })
        })
        // Remove users name
        cy.updateUserInformation()
      })
  })
})
