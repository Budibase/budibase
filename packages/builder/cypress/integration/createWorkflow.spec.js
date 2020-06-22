context('Create a workflow', () => {

    before(() => {
        cy.visit('localhost:4001/_builder')

        cy.createApp('Workflow Test App', 'This app is used to test that workflows do in fact work!')
    })

    // https://on.cypress.io/interacting-with-elements
    it('should create a workflow', () => {
        cy.createModel('dog', 'name', 'age')
        cy.createUser('bbuser', 'test', 'ADMIN')


        cy.contains('workflow').click()
        cy.get('.new-workflow-button').click()
        cy.get('input').type('Add Record')
        cy.contains('Save').click()

        // Add trigger
        cy.get('[data-cy=add-workflow-component]').click()
        cy.get('[data-cy=RECORD_SAVED]').click()
        cy.get('.budibase__input').select('dog')

        // Create action
        cy.get('[data-cy=SAVE_RECORD]').click()
        cy.get(':nth-child(2) > .budibase__input').type('goodboy')
        cy.get(':nth-child(3) > .budibase__input').type('11')

        // Save
        cy.get('[data-cy=save-workflow-setup]').click()
        cy.get('.workflow-button').click()

        // Activate Workflow
        cy.get('[data-cy=activate-workflow]').click()

    })
    it('should add record when a new record is added', () => {
        cy.contains('backend').click()

        cy.addRecord('bob', '15')

        cy.contains('goodboy').should('have.text', 'goodboy')

    })
})