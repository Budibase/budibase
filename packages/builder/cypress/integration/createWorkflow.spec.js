context('Create a workflow', () => {

    before(() => {
        Cypress.Cookies.preserveOnce('builder:token')
        cy.visit('localhost:4001/_builder')
        // https://on.cypress.io/type
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

        cy.get('[data-cy=add-workflow-component]').click()
        cy.contains('Actions').click()

        cy.get('[data-cy=SAVE_RECORD]').click()

        cy.get(':nth-child(2) > .budibase__input').type('goodboy')
        cy.get(':nth-child(3) > .budibase__input').type('11')

        // Save
        cy.get('[data-cy=save-workflow-setup]').click()
        cy.get('.workflow-button').click()

    })
    it('should be able to run', () => {
        cy.contains('frontend').click()
        cy.addButtonComponent()

    })
})