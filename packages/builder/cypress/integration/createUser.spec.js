context('Create a User', () => {

    before(() => {
        cy.visit('localhost:4001/_builder')
        // https://on.cypress.io/type
        cy.createApp('User App', 'This app is used to test user creation')
    })

    // https://on.cypress.io/interacting-with-elements
    it('should create a user', () => {
        // Close Model modal that shows up after creating an app
        cy.get('.close').click()

        cy.createUser('bbuser', 'test', 'ADMIN')

        // Check to make sure user was created!
        cy.contains('bbuser').should('have.text', 'bbuser')
    })
})
