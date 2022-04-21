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

      cy.get(".appTable")
      let appStatusEle = cy.get(".app-status").eq(0)
      appStatusEle.contains("Unpublished")
      appStatusEle.get("svg[aria-label='GlobeStrike']").should("exist")
      appStatusEle.get(".app-row-actions .spectrum-Button").contains("Preview")

      appStatusEle.get(".app-row-actions .spectrum-Button").contains("Edit").click({ force: true })

      cy.get(".app-status-icon svg[aria-label='GlobeStrike']").should("exist")
      cy.get(".app-status-icon svg[aria-label='Globe']").should("not.exist")
    })

    it("Should publish an application and correctly reflect that", () => {
      //Assuming the previous test was run and the unpublished app is open in edit mode.

      cy.get(".toprightnav button.spectrum-Button").contains("Publish").click({ force : true })

      let deployModal = cy.get(".spectrum-Modal [data-cy='deploy-app-modal']").should("be.visible")
      deployModal.within(() => {
        cy.get(".spectrum-Button").contains("Publish").click({ force : true })
        cy.wait(1000)
      });

      let deployModalSuccess = cy.get(".spectrum-Modal [data-cy='deploy-app-success-modal']")
      deployModalSuccess.should("be.visible")

      deployModalSuccess.within(() => {
        cy.get("[data-cy='deployed-app-url'] input").should('have.value', Cypress.config().baseUrl + '/app/cypress-tests')
        cy.get(".spectrum-Button").contains("Done").click({ force: true })
      });

      deployModalSuccess.should("exist")

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.wait(1000)

      cy.get(".appTable")
      let appStatusEle = cy.get(".app-status").eq(0)
      appStatusEle.contains("Published")
      appStatusEle.get("svg[aria-label='Globe']").should("exist")
      appStatusEle.get(".app-row-actions .spectrum-Button").contains("View app")

      appStatusEle.get(".app-row-actions .spectrum-Button").contains("Edit").click({ force: true })

      const publishStatusIcon = cy.get(".app-status-icon svg[aria-label='Globe']").should("exist")
      publishStatusIcon.click({ force: true })
      
      const publishingMenu = cy.get("[data-cy='publish-popover-action']")
      publishingMenu.should("be.visible")

      publishingMenu.get("button[data-cy='publish-popover-action']").should("exist")
      publishingMenu.get("button").contains("View App").should("exist")

      publishingMenu.get(".publish-popover-message").should("have.text", "Last Published: a few seconds ago")

    })

    it("Should unpublish an application from the top navigation and reflect the status change", () => {
      //Assuming the previous test app exists and is published
      
      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.get(".appTable")
      let appStatusEle = cy.get(".app-status").eq(0)
      appStatusEle.contains("Published")
      appStatusEle.get("svg[aria-label='Globe']").should("exist")
      appStatusEle.get(".app-row-actions .spectrum-Button").contains("View app")

      appStatusEle.get(".app-row-actions .spectrum-Button").contains("Edit").click({ force: true })

      //The published status 
      const publishStatusIcon = cy.get(".app-status-icon svg[aria-label='Globe']").should("exist")
      publishStatusIcon.click({ force: true })
      
      const publishingMenu = cy.get("[data-cy='publish-popover-action']")
      publishingMenu.should("be.visible")

      const unpublishButton = publishingMenu.get("button[data-cy='publish-popover-action']")
      unpublishButton.should("exist")

      unpublishButton.click({ force : true })

      const unpublishModal = cy.get("[data-cy='unpublish-modal']")
      unpublishModal.should("be.visible")
      unpublishModal.get(".confirm-wrap button").click({ force: true })

      cy.get(".app-status-icon svg[aria-label='GlobeStrike']").should("exist")

      cy.visit(`${Cypress.config().baseUrl}/builder`)

      appStatusEle = cy.get(".appTable")
      appStatusEle.get(".app-status").eq(0).contains("Unpublished")

    })
  })
})
