context('Create Model', () => {

    beforeEach(() => {
        cy.visit('localhost:4001/_builder')
    })

    // https://on.cypress.io/interacting-with-elements

    it('should create a new model', () => {
        // https://on.cypress.io/type
        cy.get('.banner-button')
            .click()
            .get('input[name="name"]')
            .type('My Cool Application').should('have.value', 'My Cool Application')

        cy.get('textarea[name="description"]')
            .type('This is a description').should('have.value', 'This is a description')

        cy.contains('Save').click()

        // Enter model name
        cy.get('.budibase__input')
            .type('dog')

        // Add new field
        cy.get('.new-field')
            .click()

        // Enter field name
        cy.get('.budibase__input').first()
            .type('name')

        // Save
        cy.contains('Save').click()


        // Add new field
        cy.get('.new-field')
            .click()

        // Enter field name
        cy.get('.budibase__input').first()
            .type('age')

        cy.get('select').select('number')

        // Save
        cy.contains('Save').click()

        cy.contains('age').should('exist')

        // Save
        cy.contains('Save').click()

        cy.get('.title').should('have.text', 'dog')
    })
    it('should add a record', () => {

        // Open just created app
        cy.get(':nth-child(1) > .card-footer > .app-button')
            .click()

        // Open add record modal
        cy.get('.button')
            .click()

        cy.get(':nth-child(1) > .uk-input').type('bob').get(':nth-child(2) > .uk-input').type('15')

        // Save
        cy.contains('Save').click()

        cy.contains('bob').should('have.text', 'bob')
    })
})
