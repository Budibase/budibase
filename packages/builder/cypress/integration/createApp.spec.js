import filterTests from '../support/filterTests'
const interact = require('../support/interact')

filterTests(['smoke', 'all'], () => {
  context("Create an Application", () => {

    before(() => {
      cy.login()
      cy.deleteApp("Cypress Tests")
    })

    if (!(Cypress.env("TEST_ENV"))) {
      it("should show the new user UI/UX", () => {
        cy.visit(`${Cypress.config().baseUrl}/builder/portal/apps/create`) //added /portal/apps/create
        cy.get(interact.CREATE_APP_BUTTON).contains('Start from scratch').should("exist")
        cy.get(interact.CREATE_APP_BUTTON).should("exist")
        
        cy.get(interact.TEMPLATE_CATEGORY_FILTER).should("exist")
        cy.get(interact.TEMPLATE_CATEGORY).should("exist")
        
        cy.get(interact.APP_TABLE).should("not.exist")
      })
    }

    it("should provide filterable templates", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)

      cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
        .its("body")
        .then(val => {
          if (val.length > 0) {
            cy.get(interact.SPECTRUM_BUTTON_TEMPLATE).contains("Templates").click({force: true})
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
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)

      // Start create app process. If apps already exist, click second button
      cy.get(interact.CREATE_APP_BUTTON).click({ force: true })
      cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
        .its("body")
        .then(val => {
          if (val.length > 0) {
            cy.get(interact.CREATE_APP_BUTTON).click({ force: true })
          }
        })

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

    it("should create the first application from scratch", () => {
      const appName = "Cypress Tests"
      cy.createApp(appName)

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(1000)

      cy.applicationInAppTable(appName)
      cy.deleteApp(appName)
    })

    it("should create the first application from scratch with a default name", () => {
      cy.createApp()

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(1000)

      cy.applicationInAppTable("My app")
      cy.deleteApp("My app")
    })

    it("should create the first application from scratch, using the users first name as the default app name", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.updateUserInformation("Ted", "Userman")
      
      cy.createApp()

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(1000)

      cy.applicationInAppTable("Teds app")
      cy.deleteApp("Teds app")

      //Accomodate names that end in 'S'
      cy.updateUserInformation("Chris", "Userman")
      
      cy.createApp()

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(1000)

      cy.applicationInAppTable("Chris app")
      cy.deleteApp("Chris app")

      cy.updateUserInformation("", "")
    })

    it("should create an application from an export", () => {
      const exportedApp = 'cypress/fixtures/exported-app.txt'

      cy.importApp(exportedApp, "")

      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.applicationInAppTable("My app")
      
      cy.get(".appTable .name").eq(0).click()

      cy.deleteApp("My app")
    })

    it("should create an application from an export, using the users first name as the default app name", () => {
      const exportedApp = 'cypress/fixtures/exported-app.txt'

      cy.updateUserInformation("Ted", "Userman")

      cy.importApp(exportedApp, "")

      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.applicationInAppTable("Teds app")
      
      cy.get(".appTable .name").eq(0).click()

      cy.deleteApp("Teds app")

      cy.updateUserInformation("", "")
    })

    it("should generate the first application from a template", () => {
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
        cardOverlay.get("button").contains("Use template").should("exist").click({force: true})
      })

      // CMD Create app from theme card
      cy.get(".spectrum-Modal").should('be.visible')
      
      const templateName = cy.get(".spectrum-Modal .template-thumbnail-text")
      templateName.invoke('text')
      .then(templateNameText => {
        const templateNameParsed = "/"+templateNameText.toLowerCase().replace(/\s+/g, "-")
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
      cy.wait(500)

      // Create second app
      const secondAppName = "Second App Demo"
      cy.createApp(secondAppName)

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)

      //Both applications should exist and be searchable
      cy.searchForApplication(appName)
      cy.searchForApplication(secondAppName)

      cy.deleteApp(secondAppName)
    })

  })  
})
