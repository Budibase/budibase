import filterTests from '../support/filterTests'
const interact = require('../support/interact')

filterTests(['smoke', 'all'], () => {
  context("Create an Application", () => {

    before(() => {
      cy.login()
      cy.deleteAllApps()
    })

    if (!(Cypress.env("TEST_ENV"))) {
      it.skip("should show the new user UI/UX", () => {
        cy.visit(`${Cypress.config().baseUrl}/builder/portal/apps/create`, { timeout: 5000 }) //added /portal/apps/create
        cy.wait(1000)
        cy.get(interact.CREATE_APP_BUTTON, { timeout: 10000 }).contains('Start from scratch').should("exist")

        cy.get(interact.TEMPLATE_CATEGORY_FILTER).should("exist")
        cy.get(interact.TEMPLATE_CATEGORY).should("exist")

        cy.get(interact.APP_TABLE).should("not.exist")
      })
    }

    xit("should provide filterable templates", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000 })
      cy.wait(500)

      cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
        .its("body")
        .then(val => {
          if (val.length > 0) {
            cy.get(interact.SPECTRUM_BUTTON).contains("View Templates").click({ force: true })
          }
        })

      cy.get(interact.TEMPLATE_CATEGORY_FILTER).should("exist")
      cy.get(interact.TEMPLATE_CATEGORY).should("exist")

      cy.get(interact.TEMPLATE_CATEGORY_ACTIONGROUP).its('length').should('be.gt', 1)
      cy.get(interact.TEMPLATE_CATEGORY_FILTER_ACTIONBUTTON).its('length').should('be.gt', 2)

      cy.get(interact.TEMPLATE_CATEGORY_FILTER_ACTIONBUTTON).eq(1).click()
      cy.get(interact.TEMPLATE_CATEGORY_ACTIONGROUP).should('have.length', 1)

      cy.get(interact.TEMPLATE_CATEGORY_FILTER_ACTIONBUTTON).eq(0).click()
      cy.get(interact.TEMPLATE_CATEGORY_ACTIONGROUP).its('length').should('be.gt', 1)
    })

    it("should enforce a valid url before submission", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 10000 })

      // Start create app process. If apps already exist, click second button
      cy.wait(1000)
      cy.get(interact.CREATE_APP_BUTTON, { timeout: 3000 }).click({ force: true })

      const appName = "Cypress Tests"
      cy.get(interact.SPECTRUM_MODAL).within(() => {

        cy.get(interact.APP_NAME_INPUT).eq(0).should('have.focus')

        //Auto fill
        cy.get(interact.APP_NAME_INPUT).eq(0).clear()
        cy.get(interact.APP_NAME_INPUT).eq(0).type(appName).should("have.value", appName).blur()
        cy.get(interact.APP_NAME_INPUT).eq(1).should("have.value", "/cypress-tests")
        cy.get(interact.SPECTRUM_BUTTON_GROUP).contains("Create app").should('not.be.disabled')

        //Empty the app url - disabled create
        cy.get(interact.APP_NAME_INPUT).eq(1).clear().blur()
        cy.get(interact.SPECTRUM_BUTTON_GROUP).contains("Create app").should('be.disabled')

        //Invalid url
        cy.get(interact.APP_NAME_INPUT).eq(1).type("/new app-url").blur()
        cy.get(interact.SPECTRUM_BUTTON_GROUP).contains("Create app").should('be.disabled')

        //Specifically alter the url
        cy.get(interact.APP_NAME_INPUT).eq(1).clear()
        cy.get(interact.APP_NAME_INPUT).eq(1).type("another-app-name").blur()
        cy.get(interact.APP_NAME_INPUT).eq(1).should("have.value", "/another-app-name")
        cy.get(interact.APP_NAME_INPUT).eq(0).should("have.value", appName)
        cy.get(interact.SPECTRUM_BUTTON_GROUP).contains("Create app").should('not.be.disabled')

      })
    })

    it.skip("should create the first application from scratch", () => {
      const appName = "Cypress Tests"
      cy.createApp(appName, false)

      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000 })

      cy.applicationInAppTable(appName)
      cy.deleteApp(appName)
    })

    it.skip("should create the first application from scratch with a default name", () => {
      cy.updateUserInformation("", "")
      cy.createApp("", false)
      cy.applicationInAppTable("My app")
      cy.deleteApp("My app")
    })

    it("should create the first application from scratch, using the users first name as the default app name", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000 })

      cy.updateUserInformation("Ted", "Userman")

      cy.createApp("", false)
      cy.applicationInAppTable("Teds app")
      cy.deleteApp("Teds app")

      // Accomodate names that end in 'S'
      cy.updateUserInformation("Chris", "Userman")

      cy.createApp("", false)
      cy.applicationInAppTable("Chris app")
      cy.deleteApp("Chris app")

      cy.updateUserInformation("", "")
    })

    it("should create an application from an export", () => {
      const exportedApp = 'cypress/fixtures/exported-app.txt'

      cy.importApp(exportedApp, "")
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 2000 })
      cy.applicationInAppTable("My app")
      cy.get(".app-table .name").eq(0).click()
      cy.closeModal()
      cy.get(`[aria-label="ShowMenu"]`).click()
      cy.get(".spectrum-Menu").within(() => {
        cy.contains("Overview").click()
      })
      cy.get(".app-overview-actions-icon").within(() => {
        cy.get(".spectrum-Icon").click({ force: true })
      })
      cy.get(".spectrum-Menu").contains("Delete").click({ force: true })
      cy.get(".spectrum-Dialog-grid").within(() => {
        cy.get("input").type("My app")
      })
      cy.get(".spectrum-Button--warning").click()
    })

    it("should create an application from an export, using the users first name as the default app name", () => {
      const exportedApp = 'cypress/fixtures/exported-app.txt'

      cy.updateUserInformation("Ted", "Userman")
      cy.importApp(exportedApp, "")
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.applicationInAppTable("Teds app")
      cy.get(".app-table .name").eq(0).click()
      cy.closeModal()
      cy.get(`[aria-label="ShowMenu"]`).click()
      cy.get(".spectrum-Menu").within(() => {
        cy.contains("Overview").click()
      })
      cy.get(".app-overview-actions-icon").within(() => {
        cy.get(".spectrum-Icon").click({ force: true })
      })
      cy.get(".spectrum-Menu").contains("Delete").click({ force: true })
      cy.get(".spectrum-Dialog-grid").within(() => {
        cy.get("input").type("Teds app")
      })
      cy.get(".spectrum-Button--warning").click()
      cy.updateUserInformation("", "")
    })

    xit("should generate the first application from a template", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)

      // Navigate to Create new app section if apps already exist
      cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
        .its("body")
        .then(val => {
          if (val.length > 0) {
            cy.get(interact.CREATE_APP_BUTTON).click({ force: true })
          }
        })

      cy.get(interact.TEMPLATE_CATEGORY_FILTER).should("exist")
      cy.get(interact.TEMPLATE_CATEGORY).should("exist")

      // Select template
      cy.get(interact.TEMPLATE_CATEGORY_ACTIONGROUP).eq(0).within(() => {
        const card = cy.get('.template-card').eq(0).should("exist");
        const cardOverlay = card.get('.template-thumbnail-action-overlay').should("exist")
        cardOverlay.invoke("show")
        cardOverlay.get("button").contains("Use template").should("exist").click({ force: true })
      })

      // CMD Create app from theme card
      cy.get(".spectrum-Modal").should('be.visible')

      const templateName = cy.get(".spectrum-Modal .template-thumbnail-text")
      templateName.invoke('text')
        .then(templateNameText => {
          const templateNameParsed = "/" + templateNameText.toLowerCase().replace(/\s+/g, "-")
          cy.get(interact.SPECTRUM_MODAL_INPUT).eq(0).should("have.value", templateNameText)
          cy.get(interact.SPECTRUM_MODAL_INPUT).eq(1).should("have.value", templateNameParsed)

          cy.get(".spectrum-Modal .spectrum-ButtonGroup").contains("Create app").click()
          cy.wait(5000)

          cy.visit(`${Cypress.config().baseUrl}/builder`)
          cy.wait(2000)

          cy.applicationInAppTable(templateNameText)
          cy.deleteApp(templateNameText)
        });

    })

    it("should display a second application and app filtering", () => {
      // Create first app
      const appName = "Cypress Tests"
      cy.createApp(appName)

      cy.visit(`${Cypress.config().baseUrl}/builder`)

      // Create second app
      const secondAppName = "Second App Demo"
      cy.createApp(secondAppName)

      cy.visit(`${Cypress.config().baseUrl}/builder`)

      //Both applications should exist and be searchable
      cy.searchForApplication(appName)
      cy.searchForApplication(secondAppName)

      cy.deleteApp(secondAppName)
    })

  })
})
