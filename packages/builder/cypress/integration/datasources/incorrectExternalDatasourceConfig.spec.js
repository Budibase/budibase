context("Incorrect Datasource Configuration", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
    })
    
    it("should add incorrect config for PostgreSQL", () => {
      // This test tries to fetch immediately after selecting the datasource
      // No config is entered (default values used)
      // Select PostgreSQL datasource
      cy.selectExternalDatasource("PostgreSQL")
      
      // Attempt to fetch tables without applying config
      cy.get(".spectrum-Dialog-grid").within(() => {
        cy.get(".spectrum-Button").contains(
          "Fetch tables from database").click({ force: true })
      })
      
      // Wait 2 seconds then assert Modal has not closed
      // Modal will not close if config is incorrect
      cy.wait(2000)
      cy.get(".spectrum-Dialog-grid").should('be.visible')
      
      // Close the modal
      cy.get(".spectrum-Dialog-grid").within(() => {
        cy.get(".close-icon").click()
      })
    })
  })
