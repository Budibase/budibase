import filterTests from "../support/filterTests"
const interact = require("../support/interact")

filterTests(["all"], () => {
  xcontext("Rename an App", () => {
    beforeEach(() => {
      cy.login()
      cy.createTestApp()
    })

    it("should rename an unpublished application", () => {
      const appName = "Cypress Tests"
      const appRename = "Cypress Renamed"
      // Rename app, Search for app, Confirm name was changed
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000 })
      renameApp(appName, appRename)
      cy.reload()
      cy.searchForApplication(appRename)
      cy.get(interact.APP_TABLE).find(interact.TITLE).should("have.length", 1)
      cy.applicationInAppTable(appRename)
      // Set app name back to Cypress Tests
      cy.reload()
      renameApp(appRename, appName)
    })

    xit("Should rename a published application", () => {
      // It is not possible to rename a published application
      const appName = "Cypress Tests"
      const appRename = "Cypress Renamed"
      // Publish the app
      cy.get(interact.TOP_RIGHT_NAV)
      cy.get(interact.SPECTRUM_BUTTON)
        .contains("Publish")
        .click({ force: true })
      cy.get(interact.SPECTRUM_DIALOG_GRID).within(() => {
        // Click publish again within the modal
        cy.get(interact.SPECTRUM_BUTTON)
          .contains("Publish")
          .click({ force: true })
      })
      // Rename app, Search for app, Confirm name was changed
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000 })
      renameApp(appName, appRename, true)
      cy.get(interact.APP_TABLE).find(interact.WRAPPER).should("have.length", 1)
      cy.applicationInAppTable(appRename)
    })

    it("Should try to rename an application to have no name", () => {
      const appName = "Cypress Tests"
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000 })
      renameApp(appName, " ", false, true)
      // Close modal and confirm name has not been changed
      cy.get(interact.SPECTRUM_DIALOG_GRID, { timeout: 1000 }).contains("Cancel").click()
      cy.applicationInAppTable(appName)
    })

    xit("Should create two applications with the same name", () => {
      // It is not possible to have applications with the same name
      const appName = "Cypress Tests"
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000 })
      cy.get(interact.SPECTRUM_BUTTON), { timeout: 500 }
        .contains("Create app")
        .click({ force: true })
      cy.contains(/Start from scratch/).click()
      cy.get(interact.SPECTRUM_MODAL).within(() => {
        cy.get("input").eq(0).type(appName)
        cy.get(interact.SPECTRUM_BUTTON_GROUP)
          .contains("Create app")
          .click({ force: true })
        cy.get(interact.ERROR).should(
          "have.text",
          "Another app with the same name already exists"
        )
      })
    })

    it("should validate application names", () => {
      // App name must be letters, numbers and spaces only
      // This test checks numbers and special characters specifically
      const appName = "Cypress Tests"
      const numberName = 12345
      const specialCharName = "£$%^"
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000 })
      renameApp(appName, numberName)
      cy.applicationInAppTable(numberName)
      renameApp(numberName, specialCharName)
      cy.get(interact.ERROR).should(
        "have.text",
        "App name must be letters, numbers and spaces only"
      )
      // Set app name back to Cypress Tests
      renameApp(numberName, appName)
    })

    const renameApp = (originalName, changedName, published, noName) => {
      cy.searchForApplication(originalName)
      cy.get(interact.APP_TABLE, { timeout: 1000 }).within(() => {
        cy.get(".app-row-actions button")
          .contains("Manage")
          .eq(0)
          .click({ force: true })
      })
      cy.get(".spectrum-Tabs-item").contains("Settings").click()
      cy.get(".spectrum-Tabs-item.is-selected").contains("Settings")
      cy.get(".settings-tab").should("be.visible")
      cy.get(".details-section .page-action button")
        .contains("Edit")
        .click({ force: true })
      cy.updateAppName(changedName, noName)
    }
  })
})
