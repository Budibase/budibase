import filterTests from '../support/filterTests'

filterTests(['smoke', 'all'], () => {
  context("Create an Application", () => {

    beforeEach(() => {
      cy.login()
    })

    it("should show the new user UI/UX", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(`[data-cy="create-app-btn"]`).contains('Start from scratch').should("exist")
      cy.get(`[data-cy="import-app-btn"]`).should("exist")
      
      cy.get(".template-category-filters").should("exist")
      cy.get(".template-categories").should("exist")
      
      cy.get(".appTable").should("not.exist")
    })

    it("should provide filterable templates", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)

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

      const appName = "A New App"
      
      cy.get(`[data-cy="create-app-btn"]`).contains('Start from scratch').click({force: true})
      cy.get(".spectrum-Modal").within(() => {

        //Auto fill
        cy.get("input").eq(0).type(appName).should("have.value", appName).blur()
        cy.get("input").eq(1).should("have.value", "/a-new-app")
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
      cy.deleteApp(appName)
      cy.createApp(appName, "This app is used for Cypress testing.")

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(1000)

      cy.applicationInAppTable(appName)
      cy.deleteApp(appName)
    })

    it("should generate the first application from a template", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)

      cy.get(".template-category-filters").should("exist")
      cy.get(".template-categories").should("exist")

      //### Select nth template and choose to create?
      cy.get('.template-category').eq(0).within(() => {
        const card = cy.get('.template-card').eq(0).should("exist");
        const cardOverlay = card.get('.template-thumbnail-action-overlay').should("exist")
        cardOverlay.invoke("show")
        cardOverlay.get("button").contains("Use template").should("exist").click({force: true})
      })

      //### CMD Create app from theme card
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
        cy.wait(1000)

        cy.applicationInAppTable(templateNameText)
        cy.deleteAllApps() 
      });

    })

    it("should display a second application and app filtering", () => {
      const appName = "Cypress Tests"
      cy.deleteApp(appName)
      cy.createApp(appName, "This app is used for Cypress testing.")

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)

      const secondAppName = "Second App Demo"
      cy.deleteApp(secondAppName)

      cy.get(`[data-cy="create-app-btn"]`).contains('Create new app').click({force: true})
      cy.wait(500)
      cy.url().should('include', '/builder/portal/apps/create')

      cy.createAppFromScratch(secondAppName)

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(500)

      //Both applications should exist and be searchable
      cy.searchForApplication(appName)
      cy.searchForApplication(secondAppName)

      cy.deleteAllApps()
    })

  })  
})
