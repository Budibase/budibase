import filterTests from "../../support/filterTests"
const interact = require('../../support/interact')

filterTests(["smoke", "all"], () => {
  xcontext("User Management", () => {
    before(() => {
      cy.login()
      cy.deleteApp("Cypress Tests")
      cy.createApp("Cypress Tests", false)
    })

    xit("should create a user via basic onboarding", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000})
      cy.createUser("bbuser@test.com")
      cy.get(interact.SPECTRUM_TABLE).should("contain", "bbuser")
    })

    xit("should confirm App User role for a New User", () => {
      cy.contains("bbuser").click()
      cy.get(".spectrum-Form-itemField").eq(3).should('contain', 'App User')

      // User should not have app access
      cy.get(".spectrum-Heading").contains("Apps").parent().within(() => {
        cy.get(interact.LIST_ITEMS, { timeout: 500 }).should("contain", "This user has access to no apps")
      })
    })

    if (Cypress.env("TEST_ENV")) {
      xit("should assign role types", () => {
        // 3 apps minimum required - to assign an app to each role type
        cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
          .its("body")
          .then(val => {
            if (val.length < 3) {
              for (let i = 1; i < 3; i++) {
                const uuid = () => Cypress._.random(0, 1e6)
                const name = uuid()
                if(i < 1){
                  cy.createApp(name, false)
                } else {
                  cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000})
                  cy.wait(1000)
                  cy.get(interact.CREATE_APP_BUTTON, { timeout: 2000 }).click({ force: true })
                  cy.createAppFromScratch(name)
                }
              }
            }
          })
        // Navigate back to the user
        cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000})
        cy.get(interact.SPECTRUM_SIDENAV).contains("Users").click()
        cy.get(interact.SPECTRUM_TABLE, { timeout: 1000 }).contains("bbuser").click()
        cy.get(interact.SPECTRUM_HEADING).contains("bbuser", { timeout: 2000})
        for (let i = 0; i < 3; i++) {
          cy.get(interact.SPECTRUM_TABLE, { timeout: 3000})
            .eq(1)
            .find(interact.SPECTRUM_TABLE_ROW)
            .eq(0)
            .find(interact.SPECTRUM_TABLE_CELL)
            .eq(0)
            .click()
          cy.get(interact.SPECTRUM_DIALOG_GRID, { timeout: 1000 })
            .contains("Choose an option")
            .click()
            .then(() => {
              if (i == 0) {
                cy.get(interact.SPECTRUM_MENU, { timeout: 2000 }).contains("Admin").click({ force: true })
              }
              else if (i == 1) {
                cy.get(interact.SPECTRUM_MENU, { timeout: 2000 }).contains("Power").click({ force: true })
              }
              else if (i == 2) {
                cy.get(interact.SPECTRUM_MENU, { timeout: 2000 }).contains("Basic").click({ force: true })
              }
              cy.get(interact.SPECTRUM_BUTTON, { timeout: 2000 })
                .contains("Update role")
                .click({ force: true })
            })
            cy.reload()
            cy.wait(1000)
        }
        // Confirm roles exist within Configure roles table
        cy.get(interact.SPECTRUM_TABLE, { timeout: 20000 })
          .eq(0)
          .within(assginedRoles => {
            expect(assginedRoles).to.contain("Admin")
            expect(assginedRoles).to.contain("Power")
            expect(assginedRoles).to.contain("Basic")
          })
      })
  
      xit("should unassign role types", () => {
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

    xit("should enable Developer access and verify application access", () => {
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

    xit("should disable Developer access and verify application access", () => {
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

    xit("Should edit user details within user details page", () => {
      // Add First name
      cy.get(interact.FIELD, { timeout: 1000 }).eq(1).within(() => {
        cy.wait(500)
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT, { timeout: 1000 }).wait(500).clear().click().type("bb")
      })
      // Add Last name
      cy.get(interact.FIELD, { timeout: 1000 }).eq(2).within(() => {
        cy.wait(500)
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT, { timeout: 1000 }).click().wait(500).clear().type("test")
      })
      cy.get(interact.FIELD, { timeout: 1000 }).eq(0).click()
      // Reload page
      cy.reload()

      // Confirm details have been saved
      cy.get(interact.FIELD, { timeout: 20000 }).eq(1).within(() => {
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT).should('have.value', "bb")
      })
      cy.get(interact.FIELD, { timeout: 1000 }).eq(2).within(() => {
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT, { timeout: 1000 }).should('have.value', "test")
      })
    })

    xit("should reset the users password", () => {
      cy.get(".title").within(() => {
        cy.get(interact.SPECTRUM_ICON).click({ force: true })
      })
      cy.get(interact.SPECTRUM_MENU).within(() => {
        cy.get(interact.SPECTRUM_MENU_ITEM).contains("Force password reset").click({ force: true })
      })

      // Reset password modal
      cy.get(interact.SPECTRUM_DIALOG_GRID)
      .find(interact.SPECTRUM_TEXTFIELD_INPUT).invoke('val').as('pwd')
      cy.get(interact.SPECTRUM_BUTTON).contains("Reset password").click({ force: true })
      cy.get(interact.SPECTRUM_BUTTON).contains("Reset password").should('not.exist')

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
      cy.login("bbuser@test.com", "test")
      cy.get(".avatar > .icon").click({ force: true })

      cy.get(".spectrum-Menu-item").contains("Update user information").click({ force: true })
      cy.get(interact.SPECTRUM_TEXTFIELD_INPUT)
      .eq(0)
      .invoke('val').should('eq', 'bbuser@test.com')
      
      // Logout and login as previous user
      cy.logoutNoAppGrid()
      cy.login()
      })

    xit("should delete a user", () => {
      cy.deleteUser("bbuser@test.com")
      cy.get(interact.SPECTRUM_TABLE, { timeout: 4000 }).should("not.have.text", "bbuser")
    })
  })
})
