import filterTests from "../support/filterTests"
const interact = require('../support/interact')

filterTests(['all'], () => {
  context("Publish Application Workflow", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
    })

    it("Should reflect the unpublished status correctly", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(1000)

      cy.get(interact.APP_TABLE_STATUS).eq(0)
      .within(() => {
        cy.contains("Unpublished")
        cy.get("svg[aria-label='GlobeStrike']").should("exist")
      })

      cy.get(interact.APP_TABLE_ROW_ACTION).eq(0)
      .within(() => {
        cy.get(interact.SPECTRUM_BUTTON_TEMPLATE).contains("Preview")
        cy.get(interact.SPECTRUM_BUTTON_TEMPLATE).contains("Edit").click({ force: true })
      })
      
      cy.get(interact.DEPLOYMENT_TOP_NAV_GLOBESTRIKE).should("exist")
      cy.get(interact.DEPLOYMENT_TOP_GLOBE).should("not.exist")
    })

    it("Should publish an application and correctly reflect that", () => {
      //Assuming the previous test was run and the unpublished app is open in edit mode.
      cy.get(interact.TOPRIGHTNAV_BUTTON_SPECTRUM).contains("Publish").click({ force : true })

      cy.get(".spectrum-Modal [data-cy='deploy-app-modal']").should("be.visible")
      .within(() => {
        cy.get(interact.SPECTRUM_BUTTON_TEMPLATE).contains("Publish").click({ force : true })
        cy.wait(1000)
      });

      //Verify that the app url is presented correctly to the user
      cy.get(".spectrum-Modal [data-cy='deploy-app-success-modal']")
      .should("be.visible")
      .within(() => {
        let appUrl = Cypress.config().baseUrl + '/app/cypress-tests'
        cy.get("[data-cy='deployed-app-url'] input").should('have.value', appUrl)
        cy.get(interact.SPECTRUM_BUTTON_TEMPLATE).contains("Done").click({ force: true })
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
        cy.get(".spectrum-Button").contains("View")
        cy.get(".spectrum-Button").contains("Edit").click({ force: true })
      })

      cy.get(interact.DEPLOYMENT_TOP_GLOBE).should("exist").click({ force: true })
      
      cy.get(interact.PUBLISH_POPOVER_MENU).should("be.visible")
      .within(() => {
        cy.get(interact.PUBLISH_POPOVER_ACTION).should("exist")
        cy.get("button").contains("View app").should("exist")
        cy.get(interact.PUBLISH_POPOVER_MESSAGE).should("have.text", "Last published a few seconds ago")
      })
    })

    it("Should unpublish an application from the top navigation and reflect the status change", () => {
      //Assuming the previous test app exists and is published
      
      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.get(interact.APP_TABLE_STATUS).eq(0)
      .within(() => {
        cy.contains("Published")
        cy.get("svg[aria-label='Globe']").should("exist")
      })

      cy.get(".appTable .app-row-actions").eq(0)
      .within(() => {
        cy.get(interact.SPECTRUM_BUTTON).contains("View app")
        cy.get(interact.SPECTRUM_BUTTON).contains("Edit").click({ force: true })
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
