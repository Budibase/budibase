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
      addTransformerQuery()
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
    addTransformerQuery(true)
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
    url: 'https://test.budi.live/api/queries/',
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
    url: 'https://test.budi.live/api/queries/preview',
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
    
  const addTransformerQuery = (addData = false) => {
    // Adds query within the Transformer section of Query REST API
    cy.get(".CodeMirror textarea")
    // Highlight current text within CodeMirror
    .type(Cypress.platform === 'darwin' ? '{cmd}a' : '{ctrl}a', { force: true })
    // Overwrite current text with function
    .type("const breweries = data\n" +
    "const totals = {}\n" +
    "for (let brewery of breweries) {")
    // Delete key in place to remove extra brackets that are added
    .type('{del}')
    .type("\n const state = brewery.state\n" +
    " if (totals[state] == null) {")
    .type('{del}')
    .type("\n   totals[state] = 1\n" +
    "} else {")
    .type('{del}')
    .type("\n  totals[state]++\n" +
    "}}\n", { parseSpecialCharSequences: false })
    
    if (addData) {
      cy.get(".CodeMirror textarea")
      .type('const stateCodes = {"texas":"tx",\n' +
      '"colorado":"co",\n' +
      '"florida":"fl",\n' +
      '"iwoa":"ia",\n' +
      '"louisiana":"la",\n' +
      '"california":"ca",\n' +
      '"pennsylvania":"pa",\n' +
      '"georgia":"ga",\n' +
      '"new hampshire":"nh",\n' +
      '"virginia":"va",\n' +
      '"michigan":"mi",\n' +
      '"maryland":"md",\n' +
      '"ohio":"oh"}\n')
      .type('const entries = Object.entries(totals)\n' +
      "return entries.map(([state, count]) => \n" +
      "{ const stateCode = stateCodes[state.toLowerCase()]\n" +
      "return {state, count, flag: 'http://flags.ox3.in/svg/us/${stateCode}.svg'",
      { parseSpecialCharSequences: false })
    }
    else{
      cy.get(".CodeMirror textarea")
      .type("const entries = Object.entries(totals)\n" +
      "return entries.map(([state, count]) => ({state, count}))",
      { parseSpecialCharSequences: false })
    }
  }
})
