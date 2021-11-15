context("Datasource Wizard", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
    })

  it("should navigate in and out of a datasource via wizard", () => {
    // Select PostgreSQL and add config (without fetch)
    const datasource = "PostgreSQL"
    cy.selectExternalDatasource(datasource)
    cy.addSqlDatasourceConfig(datasource, true)
    
    // Navigate back within datasource wizard
    cy.get(".spectrum-Dialog-grid").within(() => {
      cy.get(".spectrum-Button").contains("Back").click({ force: true })
      cy.wait(1000)
    })
  
    // Select PostgreSQL datasource again
    cy.get(".item-list").contains(datasource).click()
    cy.get(".spectrum-Dialog-grid").within(() => {
      cy.get(".spectrum-Button").contains("Continue").click({ force: true })
    })
    
    // Immediately fetch tables after selection
    // Previously entered config should not have been saved
    // Config is back to default values - Modal will not close (incorrect config)
    cy.get(".spectrum-Dialog-grid").within(() => {
      cy.get(".spectrum-Button").contains("Fetch tables from database").click({ force: true })
    })
    cy.wait(2000)
    cy.get(".spectrum-Dialog-grid").should('be.visible')
    
    // Close the modal
    cy.get(".spectrum-Dialog-grid").within(() => {
      cy.get(".close-icon").click()
    })
  })
})
