import filterTests from "../../support/filterTests"
const interact = require('../../support/interact')

filterTests(["smoke", "all"], () => {
  context("User Management", () => {
    before(() => {
      cy.login()
      cy.deleteApp("Cypress Tests")
      cy.createApp("Cypress Tests")
    })

    it("should create a user via basic onboarding", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 1000})
      cy.createUser("bbuser@test.com")
      cy.get(interact.SPECTRUM_TABLE).should("contain", "bbuser")
    })

    it("should confirm basic permission for a New User", () => {
      // Basic permission = development & administraton disabled
      cy.contains("bbuser").click()
      // Confirm development and admin access are disabled
      for (let i = 4; i < 6; i++) {
        cy.wait(500)
        cy.get(interact.FIELD).eq(i).within(() => {
          //cy.get(interact.SPECTRUM_SWITCH_INPUT).should('be.disabled')
          cy.get(".spectrum-Switch-switch").should('not.be.checked')
        })
      }
      // Existing apps appear within the No Access table
      cy.get(interact.SPECTRUM_TABLE, { timeout: 500 }).eq(1).should("not.contain", "No rows found")
      // Configure roles table should not contain apps
      cy.get(interact.SPECTRUM_TABLE).eq(0).contains("No rows found")
    })

    if (Cypress.env("TEST_ENV")) {
      it("should assign role types", () => {
        // 3 apps minimum required - to assign an app to each role type
        cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
          .its("body")
          .then(val => {
            if (val.length < 3) {
              for (let i = 1; i < 3; i++) {
                const uuid = () => Cypress._.random(0, 1e6)
                const name = uuid()
                if(i < 1){
                  cy.createApp(name)
                } else {
                  cy.visit(`${Cypress.config().baseUrl}/builder`)
                  cy.get(interact.CREATE_APP_BUTTON, { timeout: 1000 }).click({ force: true })
                  cy.createAppFromScratch(name)
                }
              }
            }
          })
        // Navigate back to the user
        cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 500})
        cy.get(interact.SPECTRUM_SIDENAV).contains("Users").click()
        cy.get(interact.SPECTRUM_TABLE, { timeout: 500 }).contains("bbuser").click()
        for (let i = 0; i < 3; i++) {
          cy.get(interact.SPECTRUM_TABLE, { timeout: 3000})
            .eq(1)
            .find(interact.SPECTRUM_TABLE_ROW)
            .eq(0)
            .find(interact.SPECTRUM_TABLE_CELL)
            .eq(0)
            .click()
          cy.get(interact.SPECTRUM_DIALOG_GRID, { timeout: 500 })
            .contains("Choose an option")
            .click()
            .then(() => {
              if (i == 0) {
                cy.get(interact.SPECTRUM_MENU, { timeout: 1000 }).contains("Admin").click({ force: true })
              }
              else if (i == 1) {
                cy.get(interact.SPECTRUM_MENU, { timeout: 1000 }).contains("Power").click({ force: true })
              }
              else if (i == 2) {
                cy.get(interact.SPECTRUM_MENU, { timeout: 1000 }).contains("Basic").click({ force: true })
              }
              cy.get(interact.SPECTRUM_BUTTON, { timeout: 1000 })
                .contains("Update role")
                .click({ force: true })
            })
            cy.reload()
            cy.wait(1000)
        }
        // Confirm roles exist within Configure roles table
        cy.get(interact.SPECTRUM_TABLE, { timeout: 2000 })
          .eq(0)
          .within(assginedRoles => {
            expect(assginedRoles).to.contain("Admin")
            expect(assginedRoles).to.contain("Power")
            expect(assginedRoles).to.contain("Basic")
          })
      })
  
      it("should unassign role types", () => {
        // Set each app within Configure roles table to 'No Access'
        cy.get(interact.SPECTRUM_TABLE)
          .eq(0)
          .find(interact.SPECTRUM_TABLE_ROW)
          .its("length")
          .then(len => {
            for (let i = 0; i < len; i++) {
              cy.get(interact.SPECTRUM_TABLE)
                .eq(0)
                .find(interact.SPECTRUM_TABLE_ROW)
                .eq(0)
                .find(interact.SPECTRUM_TABLE_CELL)
                .eq(0)
                .click()
                .then(() => {
                  cy.get(interact.SPECTRUM_PICKER).eq(1).click({ force: true })
                  cy.get(interact.SPECTRUM_POPOVER, { timeout: 500 }).contains("No Access").click()
                })
              cy.get(interact.SPECTRUM_BUTTON)
                .contains("Update role")
                .click({ force: true })
            }
          })
        // Confirm Configure roles table no longer has any apps in it
        cy.get(interact.SPECTRUM_TABLE, { timeout: 1000 }).eq(0).contains("No rows found")
      })
    }

    it("should enable Developer access and verify application access", () => {
      // Enable Developer access
      cy.get(interact.FIELD)
        .eq(4)
        .within(() => {
          cy.get(interact.SPECTRUM_SWITCH_INPUT).click({ force: true })
        })
      // No Access table should now be empty
      cy.get(interact.CONTAINER)
        .contains("No Access")
        .parent()
        .within(() => {
          cy.get(interact.SPECTRUM_TABLE).contains("No rows found")
        })

      // Each app within Configure roles should have Admin access
      cy.get(interact.SPECTRUM_TABLE)
        .eq(0)
        .find(interact.SPECTRUM_TABLE_ROW)
        .its("length")
        .then(len => {
          for (let i = 0; i < len; i++) {
            cy.get(interact.SPECTRUM_TABLE)
              .eq(0)
              .find(interact.SPECTRUM_TABLE_ROW)
              .eq(i)
              .contains("Admin")
            cy.wait(500)
          }
        })
    })

    it("should disable Developer access and verify application access", () => {
      // Disable Developer access
      cy.get(interact.FIELD)
        .eq(4)
        .within(() => {
          cy.get(".spectrum-Switch-input").click({ force: true })
        })
      // Configure roles table should now be empty
      cy.get(interact.CONTAINER)
        .contains("Configure roles")
        .parent()
        .within(() => {
          cy.get(interact.SPECTRUM_TABLE).contains("No rows found")
        })
    })

    it("Should edit user details within user details page", () => {
      // Add First name
      cy.get(interact.FIELD, { timeout: 500 }).eq(2).within(() => {
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT, { timeout: 500 }).type("bb")
      })
      // Add Last name
      cy.get(interact.FIELD).eq(3).within(() => {
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT).type("test")
      })
      cy.get(interact.FIELD).eq(0).click()
      // Reload page
      cy.reload()

      // Confirm details have been saved
      cy.get(interact.FIELD, { timeout: 1000 }).eq(2).within(() => {
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT).should('have.value', "bb")
      })
      cy.get(interact.FIELD).eq(3).within(() => {
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT, { timeout: 500 }).should('have.value', "test")
      })
    })

    it("should reset the users password", () => {
      cy.get(interact.REGENERATE, { timeout: 500 }).contains("Force password reset").click({ force: true })

      // Reset password modal
      cy.get(interact.SPECTRUM_DIALOG_GRID)
      .find(interact.SPECTRUM_TEXTFIELD_INPUT).invoke('val').as('pwd')
      cy.get(interact.SPECTRUM_BUTTON).contains("Reset password").click({ force: true })

      // Logout, then login with new password
      cy.logOut()
      cy.get('@pwd').then((pwd) => {
        cy.login("bbuser@test.com", pwd)
      })

      // Reset password screen
      for (let i = 0; i < 2; i++) {
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT).eq(i).type("test")
      }
      cy.get(interact.SPECTRUM_BUTTON).contains("Reset your password").click({ force: true })

      // Confirm user logged in afer password change
      cy.get(".avatar > .icon").click({ force: true })

      cy.get(".spectrum-Menu-item").contains("Update user information").click({ force: true })
      cy.get(interact.SPECTRUM_TEXTFIELD_INPUT)
      .eq(0)
      .invoke('val').should('eq', 'bbuser@test.com')
      
      // Logout and login as previous user
      cy.logoutNoAppGrid()
      cy.login()
      })

    it("should delete a user", () => {
      cy.deleteUser("bbuser@test.com")
      cy.get(interact.SPECTRUM_TABLE, { timeout: 4000 }).should("not.have.text", "bbuser")
    })
  })
})
