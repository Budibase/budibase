import filterTests from "../support/filterTests"

filterTests(['all'], () => {
  context("Publish Application Workflow", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
    })

    it("Should reflect the unpublished status correctly", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(1000)

      cy.get(".appTable .app-status").eq(0)
      .within(() => {
        cy.contains("Unpublished")
        cy.get("svg[aria-label='GlobeStrike']").should("exist")
      })

      cy.get(".appTable .app-row-actions").eq(0)
      .within(() => {
        cy.get(".spectrum-Button").contains("Preview")
        cy.get(".spectrum-Button").contains("Edit").click({ force: true })
      })
      
      cy.get(".deployment-top-nav svg[aria-label='GlobeStrike']").should("exist")
      cy.get(".deployment-top-nav svg[aria-label='Globe']").should("not.exist")
    })

    it("Should publish an application and correctly reflect that", () => {
      //Assuming the previous test was run and the unpublished app is open in edit mode.
      cy.get(".toprightnav button.spectrum-Button").contains("Publish").click({ force : true })

      cy.get(".spectrum-Modal [data-cy='deploy-app-modal']").should("be.visible")
      .within(() => {
        cy.get(".spectrum-Button").contains("Publish").click({ force : true })
        cy.wait(1000)
      });

      //Verify that the app url is presented correctly to the user
      cy.get(".spectrum-Modal [data-cy='deploy-app-success-modal']")
      .should("be.visible")
      .within(() => {
        let appUrl = Cypress.config().baseUrl + '/app/cypress-tests'
        cy.get("[data-cy='deployed-app-url'] input").should('have.value', appUrl)
        cy.get(".spectrum-Button").contains("Done").click({ force: true })
      })

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(1000)

      cy.get(".appTable .app-status").eq(0)
      .within(() => {
        cy.contains("Published")
        cy.get("svg[aria-label='Globe']").should("exist")
      })

      cy.get(".appTable .app-row-actions").eq(0)
      .within(() => {
        cy.get(".spectrum-Button").contains("View app")
        cy.get(".spectrum-Button").contains("Edit").click({ force: true })
      })

      cy.get(".deployment-top-nav svg[aria-label='Globe']").should("exist").click({ force: true })
      
      cy.get("[data-cy='publish-popover-menu']").should("be.visible")
      .within(() => {
        cy.get("[data-cy='publish-popover-action']").should("exist")
        cy.get("button").contains("View app").should("exist")
        cy.get(".publish-popover-message").should("have.text", "Last published a few seconds ago")
      })
    })

    it("Should unpublish an application from the top navigation and reflect the status change", () => {
      //Assuming the previous test app exists and is published
      
      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.get(".appTable .app-status").eq(0)
      .within(() => {
        cy.contains("Published")
        cy.get("svg[aria-label='Globe']").should("exist")
      })

      cy.get(".appTable .app-row-actions").eq(0)
      .within(() => {
        cy.get(".spectrum-Button").contains("View app")
        cy.get(".spectrum-Button").contains("Edit").click({ force: true })
      })

      //The published status 
      cy.get(".deployment-top-nav svg[aria-label='Globe']").should("exist")
      .click({ force: true })

      cy.get("[data-cy='publish-popover-menu']").should("be.visible")
      cy.get("[data-cy='publish-popover-menu'] [data-cy='publish-popover-action']")
      .click({ force : true })

      cy.get("[data-cy='unpublish-modal']").should("be.visible")
      .within(() => {
        cy.get(".confirm-wrap button").click({ force: true }
      )})

      cy.get(".deployment-top-nav svg[aria-label='GlobeStrike']").should("exist")

      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.get(".appTable .app-status").eq(0).contains("Unpublished")

    })
  })
})
