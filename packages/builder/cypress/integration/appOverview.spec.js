import filterTests from "../support/filterTests"

filterTests(['all'], () => {
  context("Application Overview screen", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
    })
    
    /*
      The ability to switch accounts will deffo be necessary

      x APP Screen
        Click on app name
        Click on edit
      
      x Edit Icon Functionality

      Lock button display and behaviour
      
      Edit button status and behaviour

      ** To ratifying alot of this stuff will require the app itself
        cy.visit(`${Cypress.config().baseUrl}/builder`)
        cy.wait(2000)
        cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
          .its("body")
          .then(val => {
            const findAppName = val.some(val => val.name == name)
            if (findAppName) {

      Publish Card
        x Never published
        Unpublished
          Should show the last valid publish date
        x Published
          Should show the valid publish date
      Edit Card
        D or DH or the first letter of their email.
        Timestamp vaguely matches.
      Version Card
        How to get use cases? Available/Unavailable?
      
      Settings Tab
        Edit Url
        Edit Name

        Versioning?

      Tab behaviour
        Click all 3 main tabs.
        Check positioning.
        Dashcard behaviour. Concentrate on the App version
          Header behaviour on click
          Quick link behaviour 

      Locking behaviour
        Button contents, D or DH or the first letter of their email.
        Locked by you
        Locked by someone else

        Timeout check. Apps > edit > back > app title
        "This lock will expire in 10 minutes from now"
    */

    it("Should be accessible from the applications list", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      
      // Reusable command? toAppOverview
      cy.get(".appTable .title").eq(0)
      .invoke('attr', 'data-cy')
      .then(($dataCy) => {
        const dataCy = $dataCy;
        cy.get(".appTable .name").eq(0).click()

        cy.location().should((loc) => {
          expect(loc.pathname).to.eq('/builder/portal/overview/' + dataCy)
        })
      })

      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.get(".appTable .title").eq(0)
      .invoke('attr', 'data-cy')
      .then(($dataCy) => {
        const dataCy = $dataCy;
        cy.get(".appTable .app-row-actions button").contains("View").click({force: true})

        cy.location().should((loc) => {
          expect(loc.pathname).to.eq('/builder/portal/overview/' + dataCy)
        })
      })

    })

    // Find a more suitable place for this.
    it("Should allow unlocking in the app list", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.get(".appTable .lock-status").eq(0).contains("Locked by you").click()

      cy.unlockApp({ owned : true })

      cy.get(".appTable").should("exist")
      cy.get(".lock-status").should('not.be.visible')
    })
    
    it("Should allow unlocking in the app overview screen", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.get(".appTable .app-row-actions button").contains("Edit").eq(0).click({force: true})
      cy.wait(1000)
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      
      cy.get(".appTable .name").eq(0).click()

      cy.get(".lock-status").eq(0).contains("Locked by you").click()

      cy.unlockApp({ owned : true })

      cy.get(".lock-status").should("not.be.visible")
    })

    it("Should reflect the deploy state of an app that hasn't been published.", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.get(".appTable .name").eq(0).click()
      
      cy.get(".header-right button.spectrum-Button[data-cy='view-app']").should("be.disabled")

      cy.get(".spectrum-Tabs-item.is-selected").contains("Overview")
      cy.get(".overview-tab").should("be.visible")

      cy.get(".overview-tab [data-cy='app-status']").within(() => {
        cy.get(".status-display").contains("Unpublished")
        cy.get(".status-display .icon svg[aria-label='GlobeStrike']").should("exist")
        cy.get(".status-text").contains("-")
      })
    })

    it("Should reflect the app deployment state", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button").contains("Edit").eq(0).click({force: true})
      
      cy.get(".toprightnav button.spectrum-Button").contains("Publish").click({ force : true })
      cy.get(".spectrum-Modal [data-cy='deploy-app-modal']").should("be.visible")
      .within(() => {
        cy.get(".spectrum-Button").contains("Publish").click({ force : true })
        cy.wait(1000)
      });

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .name").eq(0).click()

      cy.get(".header-right button.spectrum-Button[data-cy='view-app']").should("not.be.disabled")

      cy.get(".overview-tab [data-cy='app-status']").within(() => {
        cy.get(".status-display").contains("Published")
        cy.get(".status-display .icon svg[aria-label='GlobeCheck']").should("exist")
        cy.get(".status-text").contains("Last published a few seconds ago")
      })
    })

    it("Should reflect an application that has been unpublished", () => { 
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button").contains("Edit").eq(0).click({force: true})

      cy.get(".deployment-top-nav svg[aria-label='Globe']")
      .click({ force: true })

      cy.get("[data-cy='publish-popover-menu']").should("be.visible")
      cy.get("[data-cy='publish-popover-menu'] [data-cy='publish-popover-action']")
      .click({ force : true })
      
      cy.get("[data-cy='unpublish-modal']").should("be.visible")
      .within(() => {
        cy.get(".confirm-wrap button").click({ force: true }
      )})
      cy.wait(1000)

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .name").eq(0).click()

      cy.get(".overview-tab [data-cy='app-status']").within(() => {
        cy.get(".status-display").contains("Unpublished")
        cy.get(".status-display .icon svg[aria-label='GlobeStrike']").should("exist")
        cy.get(".status-text").contains("Last published a few seconds ago")
      })
    })

    it("Should allow the editing of the application icon", () => { 
      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.get(".appTable .name").eq(0).click()

      cy.get(".app-logo .edit-hover").should("exist").invoke("show").click()

      cy.customiseAppIcon()

      cy.get(".app-logo")
      .within(() => {
        cy.get('[aria-label]').eq(0).children()
        .should('have.attr', 'xlink:href').and('not.contain', '#spectrum-icon-18-Apps')
        cy.get(".app-icon")
        .should('have.attr', 'style').and('contains', 'color')
      })
    })

    it("Should log out.", () => { 
      //You
      //Last edited a few seconds ago.
      cy.logOut();
    })
  })
})
