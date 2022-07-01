import filterTests from "../support/filterTests"
const interact = require('../support/interact')

filterTests(["smoke", "all"], () => {
  context("Query Level Transformers", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
    })

    it("should write a transformer function", () => {
      // Add REST datasource - contains API for breweries
      const datasource = "REST"
      const restUrl = "https://api.openbrewerydb.org/breweries"
      cy.selectExternalDatasource(datasource)
      cy.createRestQuery("GET", restUrl, "/breweries")
      cy.get(interact.SPECTRUM_TABS_ITEM).contains("Transformer").click()
      // Get Transformer Function from file
      cy.readFile("cypress/support/queryLevelTransformerFunction.js").then(
        transformerFunction => {
          cy.get(interact.CODEMIRROR_TEXTAREA)
            // Highlight current text and overwrite with file contents
            .type(Cypress.platform === "darwin" ? "{cmd}a" : "{ctrl}a", {
              force: true,
            })
            .type(transformerFunction, { parseSpecialCharSequences: false })
        }
      )
      // Send Query
      cy.intercept("**/queries/preview").as("query")
      cy.get(interact.SPECTRUM_BUTTON).contains("Send").click({ force: true })
      cy.wait("@query")
      // Assert against Status Code, body, & body rows
      cy.get("@query").its("response.statusCode").should("eq", 200)
      cy.get("@query").its("response.body").should("not.be.empty")
      cy.get("@query").its("response.body.rows").should("not.be.empty")
    })

    it("should add data to the previous query", () => {
      // Add REST datasource - contains API for breweries
      const datasource = "REST"
      const restUrl = "https://api.openbrewerydb.org/breweries"
      cy.selectExternalDatasource(datasource)
      cy.createRestQuery("GET", restUrl, "/breweries")
      cy.get(interact.SPECTRUM_TABS_ITEM).contains("Transformer").click()
      // Get Transformer Function with Data from file
      cy.readFile(
        "cypress/support/queryLevelTransformerFunctionWithData.js"
      ).then(transformerFunction => {
        //console.log(transformerFunction[1])
        cy.get(interact.CODEMIRROR_TEXTAREA)
          // Highlight current text and overwrite with file contents
          .type(Cypress.platform === "darwin" ? "{cmd}a" : "{ctrl}a", {
            force: true,
          })
          .type(transformerFunction, { parseSpecialCharSequences: false })
      })
      // Send Query
      cy.intercept("**/queries/preview").as("query")
      cy.get(interact.SPECTRUM_BUTTON).contains("Send").click({ force: true })
      cy.wait("@query")
      // Assert against Status Code, body, & body rows
      cy.get("@query").its("response.statusCode").should("eq", 200)
      cy.get("@query").its("response.body").should("not.be.empty")
      cy.get("@query").its("response.body.rows").should("not.be.empty")
    })

    it("should run an invalid query within the transformer section", () => {
      // Add REST datasource - contains API for breweries
      const datasource = "REST"
      const restUrl = "https://api.openbrewerydb.org/breweries"
      cy.selectExternalDatasource(datasource)
      cy.createRestQuery("GET", restUrl, "/breweries")
      cy.get(interact.SPECTRUM_TABS_ITEM).contains("Transformer").click()
      // Clear the code box and add "test"
      cy.get(interact.CODEMIRROR_TEXTAREA)
        .type(Cypress.platform === "darwin" ? "{cmd}a" : "{ctrl}a", {
          force: true,
        })
        .type("test")
      // Run Query and intercept
      cy.intercept("**/preview").as("queryError")
      cy.get(interact.SPECTRUM_BUTTON).contains("Send").click({ force: true })
      cy.wait("@queryError")
      cy.wait(500)
      // Assert against message and status for the query error
      cy.get("@queryError")
        .its("response.body")
        .should("have.property", "message", "test is not defined")
      cy.get("@queryError")
        .its("response.body")
        .should("have.property", "status", 400)
    })

    xit("should run an invalid query via POST request", () => {
      // POST request with transformer as null
      cy.request({
        method: "POST",
        url: `${Cypress.config().baseUrl}/api/queries/`,
        body: {
          fields: { headers: {}, queryString: null, path: null },
          parameters: [],
          schema: {},
          name: "test",
          queryVerb: "read",
          transformer: null,
          datasourceId: "test",
        },
        // Expected 400 error - Transformer must be a string
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.include(
          'Invalid body - "transformer" must be a string'
        )
      })
    })

    xit("should run an empty query", () => {
      // POST request with Transformer as an empty string
      cy.request({
        method: "POST",
        url: `${Cypress.config().baseUrl}/api/queries/preview`,
        body: {
          fields: { headers: {}, queryString: null, path: null },
          queryVerb: "read",
          transformer: "",
          datasourceId: "test",
        },
        // Expected 400 error - Transformer is not allowed to be empty
        failOnStatusCode: false,
      }).then(response => {
        expect(response.status).to.equal(400)
        expect(response.body.message).to.include(
          'Invalid body - "transformer" is not allowed to be empty'
        )
      })
    })
  })
})
