context('Create Application', () => {

    beforeEach(() => {
        cy.visit('localhost:4001/_builder')
    })

    // https://on.cypress.io/interacting-with-elements

    it('should create a new application', () => {
        // https://on.cypress.io/type
        cy.get('.banner-button')
            .click()
            .get('input[name="name"]')
            .type('My Cool Application').should('have.value', 'My Cool Application')

        cy.get('textarea[name="description"]')
            .type('This is a description').should('have.value', 'This is a description')

        cy.contains('Save').click()

        cy.visit('localhost:4001/_builder')

        cy.contains('My Cool Application')
    })
})
