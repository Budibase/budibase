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
      cy.addRestDatasourceConfig(restUrl)
      // Add Query
      cy.get(".spectrum-Button").contains("Add Query").click({ force: true })
      cy.wait(500)
      
      // Get Transformer Function from file
      cy.readFile("cypress/support/queryLevelTransformerFunction.js").then((transformerFunction) => {
        console.log(transformerFunction[1])
        cy.get(".CodeMirror textarea")
        // Highlight current text and overwrite with file contents
        .type(Cypress.platform === 'darwin' ? '{cmd}a' : '{ctrl}a', { force: true })
        .type(transformerFunction, { parseSpecialCharSequences: false })
      })
      // Run Query
      cy.get(".spectrum-Button").contains("Run Query").click({ force: true })
      cy.wait(500)
      // Confirm JSON results
      cy.get(".preview").should('have.text', '{\n  "state": "Indiana",\n  "count": 1\n}')
    })
      
  it("should add data to the previous query", () => {
    // Add REST datasource - contains API for breweries
    const datasource = "REST"
    const restUrl = "https://api.openbrewerydb.org/breweries"
    cy.selectExternalDatasource(datasource)
    cy.addRestDatasourceConfig(restUrl)
    // Add Query
    cy.get(".spectrum-Button").contains("Add Query").click({ force: true })
    cy.wait(500)
    // Get Transformer Function with Data from file
    cy.readFile("cypress/support/queryLevelTransformerFunctionWithData.js").then((transformerFunction) => {
      console.log(transformerFunction[1])
      cy.get(".CodeMirror textarea")
      // Highlight current text and overwrite with file contents
      .type(Cypress.platform === 'darwin' ? '{cmd}a' : '{ctrl}a', { force: true })
      .type(transformerFunction, { parseSpecialCharSequences: false })
    })
    // Run Query
    cy.get(".spectrum-Button").contains("Run Query").click({ force: true })
    cy.wait(500)
    // Confirm JSON results
    cy.get(".preview").should(
      'have.text',
      '{\n  "state": "Indiana",\n  "count": 1,\n  "flag": "http://flags.ox3.in/svg/us/${stateCode}.svg"\n}')
  })
  
  it("should run an invalid query via POST request", () => {
    // POST request with transformer as null
    cy.request({method: 'POST',
    url: `${Cypress.config().baseUrl}/api/queries/`,
    body: {fields : {"headers":{},"queryString":null,"path":null},
    parameters : [],
    schema : {},
    name : "test",
    queryVerb : "read",
    transformer : null,
    datasourceId: "test"},
    // Expected 400 error - Transformer must be a string
    failOnStatusCode: false}).then((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.include('Invalid body - "transformer" must be a string')
    })
  })
  
  it("should run an empty query", () => {
    // POST request with Transformer as an empty string
    cy.request({method: 'POST',
    url: `${Cypress.config().baseUrl}/api/queries/preview`,
    body: {fields : {"headers":{},"queryString":null,"path":null},
    queryVerb : "read",
    transformer : "",
    datasourceId: "test"},
    // Expected 400 error - Transformer is not allowed to be empty
    failOnStatusCode: false}).then((response) => {
      expect(response.status).to.equal(400)
      expect(response.body.message).to.include('Invalid body - "transformer" is not allowed to be empty')
    })
  })
})
