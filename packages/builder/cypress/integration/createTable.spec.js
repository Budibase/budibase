context('Create a Table', () => {

    before(() => {
        cy.visit('localhost:4001/_builder')
        cy.createApp('Table App', 'Table App Description')
    })

    // https://on.cypress.io/interacting-with-elements
    it('should create a new Table', () => {

        cy.createTable('dog')

        // Check if Table exists
        cy.get('.title').should('have.text', 'dog')
    })

    // it('adds a new column to the table', () => {
    //     cy.addRecord('bob', '15')

    //     cy.contains('bob').should('have.text', 'bob')
    // })

    // it('updates a column on the table', () => {
    //     cy.addRecord('bob', '15')

    //     cy.contains('bob').should('have.text', 'bob')
    // })

    // it('edits a record', () => {
    //     cy.addRecord('bob', '15')

    //     cy.contains('bob').should('have.text', 'bob')
    // })

    // it('deletes a record', () => {
    //     cy.addRecord('bob', '15')

    //     cy.contains('bob').should('have.text', 'bob')
    // })

})
