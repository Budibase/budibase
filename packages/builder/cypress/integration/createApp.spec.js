import filterTests from '../support/filterTests'

filterTests(['smoke', 'all'], () => {
  context("Create an Application", () => {

    before(() => {
      cy.login()
      cy.deleteApp("Cypress Tests")
    })

    if (!(Cypress.env("TEST_ENV"))) {
      it("should show the new user UI/UX", () => {
        cy.visit(`${Cypress.config().baseUrl}/builder`)
        cy.get(`[data-cy="create-app-btn"]`).contains('Start from scratch').should("exist")
        cy.get(`[data-cy="import-app-btn"]`).should("exist")
        
        cy.get(".template-category-filters").should("exist")
        cy.get(".template-categories").should("exist")
        
        cy.get(".appTable").should("not.exist")
      })
    }

    it("should provide filterable templates", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)

      cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
        .its("body")
        .then(val => {
          if (val.length > 0) {
            cy.get(".spectrum-Button").contains("Templates").click({force: true})
          }
        })

      cy.get(".template-category-filters").should("exist")
      cy.get(".template-categories").should("exist")
      
      cy.get(".template-category").its('length').should('be.gt', 1)
      cy.get(".template-category-filters .spectrum-ActionButton").its('length').should('be.gt', 2)
      
      cy.get(".template-category-filters .spectrum-ActionButton").eq(1).click()
      cy.get(".template-category").should('have.length', 1)

      cy.get(".template-category-filters .spectrum-ActionButton").eq(0).click()
      cy.get(".template-category").its('length').should('be.gt', 1)
    })

    it("should enforce a valid url before submission", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)

      // Start create app process. If apps already exist, click second button
      cy.get(`[data-cy="create-app-btn"]`).click({ force: true })
      cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
        .its("body")
        .then(val => {
          if (val.length > 0) {
            cy.get(`[data-cy="create-app-btn"]`).click({ force: true })
          }
        })

      const appName = "Cypress Tests"
      cy.get(".spectrum-Modal").within(() => {

        //Auto fill
        cy.get("input").eq(0).type(appName).should("have.value", appName).blur()
        cy.get("input").eq(1).should("have.value", "/cypress-tests")
        cy.get(".spectrum-ButtonGroup").contains("Create app").should('not.be.disabled')

        //Empty the app url - disabled create
        cy.get("input").eq(1).clear().blur()
        cy.get(".spectrum-ButtonGroup").contains("Create app").should('be.disabled')

        //Invalid url
        cy.get("input").eq(1).type("/new app-url").blur()
        cy.get(".spectrum-ButtonGroup").contains("Create app").should('be.disabled')

        //Specifically alter the url
        cy.get("input").eq(1).clear()
        cy.get("input").eq(1).type("another-app-name").blur()
        cy.get("input").eq(1).should("have.value", "/another-app-name")
        cy.get("input").eq(0).should("have.value", appName)
        cy.get(".spectrum-ButtonGroup").contains("Create app").should('not.be.disabled')

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

    it("should generate the first application from a template", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)

      // Navigate to Create new app section if apps already exist
      cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
        .its("body")
        .then(val => {
          if (val.length > 0) {
            cy.get(`[data-cy="create-app-btn"]`).click({ force: true })
          }
        })

      cy.get(".template-category-filters").should("exist")
      cy.get(".template-categories").should("exist")

      // Select template
      cy.get('.template-category').eq(0).within(() => {
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
        cy.get(".spectrum-Modal input").eq(0).should("have.value", templateNameText)
        cy.get(".spectrum-Modal input").eq(1).should("have.value", templateNameParsed)

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
