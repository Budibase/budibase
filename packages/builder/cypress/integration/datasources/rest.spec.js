import filterTests from "../../support/filterTests"

filterTests(["smoke", "all"], () => {
  context("REST Datasource Testing", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
    })

    const datasource = "REST"
    const restUrl = "https://api.openbrewerydb.org/breweries"

    it("Should add REST data source with incorrect API", () => {
      // Select REST data source
      cy.selectExternalDatasource(datasource)
      // Enter incorrect api & attempt to send query
      cy.wait(500)
      cy.get(".spectrum-Button").contains("Add query").click({ force: true })
      cy.intercept("**/preview").as("queryError")
      cy.get("input").clear().type("random text")
      cy.get(".spectrum-Button").contains("Send").click({ force: true })
      // Intercept Request after button click & apply assertions
      cy.wait("@queryError")
      cy.get("@queryError")
        .its("response.body")
        .should("have.property", "message", "Invalid URL: http://random text?")
      cy.get("@queryError")
        .its("response.body")
        .should("have.property", "status", 400)
    })

    it("should add and configure a REST datasource", () => {
      // Select REST datasource and create query
      cy.selectExternalDatasource(datasource)
      cy.wait(500)
      // createRestQuery confirms query creation
      cy.createRestQuery("GET", restUrl, "/breweries")
      // Confirm status code response within REST datasource
      cy.wait(1000)
      cy.get(".stats").within(() => {
        cy.get(".spectrum-FieldLabel")
        .eq(0)
        .should("contain", 200)
      })
    })
  })
})
