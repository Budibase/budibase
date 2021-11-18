context("Add and Configure External Data Sources", () => {
    before(() => {
    cy.login()
    cy.createTestApp()
    })
    
    // PostgreSQL/MySQL tests currently only run in TEST environment
    if (Cypress.env("TEST_ENV")) {
        it("should add and configure a PostgreSQL data source", () => {
            // Select PostgreSQL datasource and add config
            const datasource = "PostgreSQL"
            cy.selectExternalDatasource(datasource)
            cy.addSqlDatasourceConfig(datasource)
            
            // Confirm fetch tables was successful
            cy.get(".query-list").then(() => {
                cy.get(".query-list-item").should('exist')
            })
        })
        
        it("should add and configure a MySQL data source", () => {
            // Select MySQL datasource and add config
            const datasource = "MySQL"
            cy.selectExternalDatasource(datasource)
            cy.addSqlDatasourceConfig(datasource)
            
            // Confirm fetch tables was successful
            cy.get(".query-list").then(() => {
                cy.get(".query-list-item").should('exist')
            })
        })
    }
    
    it("should add and configure a REST data source", () => {
        // Select REST datasource and add config
        const datasource = "REST"
        const restUrl = "https://api.openbrewerydb.org/breweries"
        cy.selectExternalDatasource(datasource)
        cy.addRestDatasourceConfig(restUrl)
        
        // Following config - Click Add Query, then Run Query
        cy.get(".spectrum-Button").contains("Add Query").click({ force: true })
        cy.wait(500)
        cy.get(".viewer-controls").within(() => {
            cy.get(".spectrum-Button").contains("Run Query").click({ force: true })
        })
        // Get the results from running query
        cy.get(".viewer").within(() => {
            cy.get(".preview").should(
                'not.have.value', 'Please run your query to fetch some data.')
        })
    })
})
