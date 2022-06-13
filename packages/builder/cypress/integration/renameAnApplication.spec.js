import filterTests from "../support/filterTests"
const interact = require('../support/interact')

filterTests(['all'], () => {
  context("Rename an App", () => {
    beforeEach(() => {
      cy.login()
      cy.createTestApp()
    })

    it("should rename an unpublished application", () => {
      const appName = "Cypress Tests"
      const appRename = "Cypress Renamed"
      // Rename app, Search for app, Confirm name was changed
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)
      renameApp(appName, appRename)
      cy.reload()
      cy.wait(1000)
      cy.searchForApplication(appRename)
      cy.get(interact.APP_TABLE).find(interact.TITLE).should("have.length", 1)
      cy.applicationInAppTable(appRename)
      // Set app name back to Cypress Tests
      cy.reload()
      cy.wait(1000)
      renameApp(appRename, appName)
    })

    xit("Should rename a published application", () => {
      // It is not possible to rename a published application
      const appName = "Cypress Tests"
      const appRename = "Cypress Renamed"
      // Publish the app
      cy.get(interact.TOP_RIGHT_NAV)
      cy.get(interact.SPECTRUM_BUTTON).contains("Publish").click({ force: true })
      cy.get(interact.SPECTRUM_DIALOG_GRID)
        .within(() => {
          // Click publish again within the modal
          cy.get(interact.SPECTRUM_BUTTON).contains("Publish").click({ force: true })
        })
      // Rename app, Search for app, Confirm name was changed
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)
      renameApp(appName, appRename, true)
      cy.get(interact.APP_TABLE).find(interact.WRAPPER).should("have.length", 1)
      cy.applicationInAppTable(appRename)
    })

    it("Should try to rename an application to have no name", () => {
      const appName = "Cypress Tests"
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)
      renameApp(appName, " ", false, true)
      cy.wait(500)
      // Close modal and confirm name has not been changed
      cy.get(interact.SPECTRUM_DIALOG_GRID).contains("Cancel").click()
      cy.reload()
      cy.wait(1000)
      cy.applicationInAppTable(appName)
    })

    xit("Should create two applications with the same name", () => {
      // It is not possible to have applications with the same name
      const appName = "Cypress Tests"
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)
      cy.get(interact.SPECTRUM_BUTTON).contains("Create app").click({ force: true })
      cy.contains(/Start from scratch/).click()
      cy.get(interact.SPECTRUM_MODAL)
        .within(() => {
          cy.get("input").eq(0).type(appName)
          cy.get(interact.SPECTRUM_BUTTON_GROUP).contains("Create app").click({ force: true })
          cy.get(interact.ERROR).should("have.text", "Another app with the same name already exists")
        })
    })

    it("should validate application names", () => {
      // App name must be letters, numbers and spaces only
      // This test checks numbers and special characters specifically
      const appName = "Cypress Tests"
      const numberName = 12345
      const specialCharName = "£$%^"
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)
      renameApp(appName, numberName)
      cy.reload()
      cy.wait(1000)
      cy.applicationInAppTable(numberName)
      cy.reload()
      cy.wait(1000)
      renameApp(numberName, specialCharName)
      cy.get(interact.ERROR).should("have.text", "App name must be letters, numbers and spaces only")
      // Set app name back to Cypress Tests
      cy.reload()
      cy.wait(1000)
      renameApp(numberName, appName)
    })

    const renameApp = (originalName, changedName, published, noName) => {
      cy.searchForApplication(originalName)
      cy.get(interact.APP_TABLE)
        .within(() => {
          cy.get(interact.AREA_LABEL_MORE).eq(0).click()
        })
      // Check for when an app is published
      if (published == true) {
        // Should not have Edit as option, will unpublish app
        cy.should("not.have.value", "Edit")
        cy.get(interact.SPECTRUM_MENU).contains("Unpublish").click()
        cy.get(interact.SPECTRUM_DIALOG_GRID).contains("Unpublish app").click()
        cy.get(".appTable > :nth-child(5) > :nth-child(2) > .spectrum-Icon").click()
      }
      cy.get(interact.APP_ROW_ACTION_MENU_POPOVER).eq(0).within(() => {
        cy.get(interact.SPECTRUM_MENU_ITEMM).contains("Edit").click({ force: true })
      })

      cy.updateAppName(changedName, noName)

    }
  })
})
