context('Create a Model', () => {

    before(() => {
        cy.visit('localhost:4001/_builder')
        // https://on.cypress.io/type
        cy.createApp('Model App', 'Model App Description')
    })

    // https://on.cypress.io/interacting-with-elements
    it('should create a new model', () => {

        cy.createModel('dog', 'name', 'age')

        // Check if model exists
        cy.get('.title').should('have.text', 'dog')
    })
    it('should add a record', () => {
        // Page needs to be reloaded for some reason, cookie might be remove between tests?
        cy.reload()

        cy.addRecord('bob', '15')

        cy.contains('bob').should('have.text', 'bob')
    })
})
