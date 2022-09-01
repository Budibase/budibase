import filterTests from "../support/filterTests"
import { APP_TABLE_APP_NAME, DEPLOY_SUCCESS_MODAL } from "../support/interact";
const interact = require('../support/interact')

filterTests(['all'], () => {
  context("Publish Application Workflow", () => {
    before(() => {
      cy.login()
      cy.deleteAllApps()
      cy.createApp("Cypress Tests", false)
    })

    it("Should reflect the unpublished status correctly", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000 })

      cy.get(interact.APP_TABLE_STATUS, { timeout: 3000 }).eq(0)
      .within(() => {
        cy.contains("Unpublished")
        cy.get(interact.GLOBESTRIKE).should("exist")
      })

      cy.get(interact.APP_TABLE_ROW_ACTION).eq(0)
      .within(() => {
        cy.get(interact.SPECTRUM_BUTTON_TEMPLATE).contains("Edit").click({ force: true })
      })

      cy.get(interact.DEPLOYMENT_TOP_NAV_GLOBESTRIKE).should("exist")
      cy.get(interact.DEPLOYMENT_TOP_GLOBE).should("not.exist")
    })

    it("Should publish an application and correctly reflect that", () => {
      //Assuming the previous test was run and the unpublished app is open in edit mode.
      cy.closeModal()
      cy.get(interact.TOPRIGHTNAV_BUTTON_SPECTRUM).contains("Publish").click({ force : true })

      cy.get(interact.DEPLOY_APP_MODAL).should("be.visible")
      .within(() => {
        cy.get(interact.SPECTRUM_BUTTON).contains("Publish").click({ force : true })
      });

      //Verify that the app url is presented correctly to the user
      cy.get(interact.DEPLOY_SUCCESS_MODAL, { timeout: 1000 })
      .should("be.visible")
      .within(() => {
        let appUrl = Cypress.config().baseUrl + '/app/cypress-tests'
        cy.get(interact.DEPLOY_APP_URL_INPUT).should('have.value', appUrl)
        cy.get(interact.SPECTRUM_BUTTON).contains("Done").click({ force: true })
      })

      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.get(interact.APP_TABLE_STATUS, { timeout: 3000 }).eq(0)
      .within(() => {
        cy.contains("Published")
        cy.get(interact.GLOBE).should("exist")
      })

      cy.get(interact.APP_TABLE_ROW_ACTION).eq(0)
      .within(() => {
        cy.get(interact.SPECTRUM_BUTTON).contains("Manage")
        cy.get(interact.SPECTRUM_BUTTON).contains("Edit").click({ force: true })
      })

      cy.get(interact.DEPLOYMENT_TOP_GLOBE).should("exist").click({ force: true })

      cy.get(interact.PUBLISH_POPOVER_MENU).should("be.visible")
      .within(() => {
        cy.get(interact.PUBLISH_POPOVER_ACTION).should("exist")
        cy.get("button").contains("View app").should("exist")
        cy.get(interact.PUBLISH_POPOVER_MESSAGE).should("have.text", "Last published a few seconds ago")
      })
    })

    it("Should unpublish an application using the link and reflect the status change", () => {
      //Assuming the previous test app exists and is published

      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000 })

      cy.get(interact.APP_TABLE_STATUS).eq(0)
      .within(() => {
        cy.contains("Published")
        cy.get("svg[aria-label='Globe']").should("exist")
      })

      cy.get(interact.APP_TABLE).eq(0)
      .within(() => {
        cy.get(interact.APP_TABLE_APP_NAME).click({ force: true })
      })

      cy.closeModal()
      cy.get(interact.DEPLOYMENT_TOP_GLOBE).should("exist").click({ force: true })
      
      cy.get("[data-cy='publish-popover-menu']")
      .within(() => {
        cy.get(interact.PUBLISH_POPOVER_ACTION).click({ force: true })
      })

      cy.get(interact.UNPUBLISH_MODAL).should("be.visible")
      .within(() => {
        cy.get(interact.CONFIRM_WRAP_BUTTON).click({ force: true }
      )})

      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 6000 })
      cy.wait(500)
      cy.get(interact.APP_TABLE_STATUS, { timeout: 10000 }).eq(0).contains("Unpublished")

    })
  })
})
