import filterTests from "../../support/filterTests"

filterTests(['all'], () => {
  xcontext("Datasource Wizard", () => {
    if (Cypress.env("TEST_ENV")) {
      before(() => {
        cy.login()
        cy.createTestApp()
      })

    it("should navigate in and out of a datasource via wizard", () => {
      // Select PostgreSQL and add config (without fetch)
      const datasource = "Oracle"
      cy.selectExternalDatasource(datasource)
      cy.addDatasourceConfig(datasource, true)
      
      // Navigate back within datasource wizard
      cy.get(".spectrum-Dialog-grid").within(() => {
        cy.get(".spectrum-Button").contains("Back").click({ force: true })
      })
    
      // Select PostgreSQL datasource again
      cy.get(".item-list", { timeout: 1000 }).contains(datasource).click()
      cy.get(".spectrum-Dialog-grid").within(() => {
        cy.get(".spectrum-Button").contains("Continue").click({ force: true })
      })
      
      // Fetch tables after selection
      // Previously entered config should not have been saved
      // Config is back to default values
      // Modal will close and provide 500 error
      cy.intercept('**/datasources').as('datasourceConnection')
      cy.get(".spectrum-Dialog-grid").within(() => {
        cy.get(".spectrum-Button").contains("Save and fetch tables").click({ force: true })
      })
      cy.wait("@datasourceConnection")
      cy.get("@datasourceConnection").its('response.body')
          .should('have.property', 'status', 500)
      })
    }
  })
})
