context('Create a User', () => {

    before(() => {
        cy.server()
        cy.visit(`localhost:${Cypress.env("PORT")}/_builder`)
        // https://on.cypress.io/type
        cy.createApp('User App', 'This app is used to test user creation')
    })

    // https://on.cypress.io/interacting-with-elements
    it('should create a user', () => {
        cy.createUser("bbuser@test.com", "test", "ADMIN")

        // // Check to make sure user was created!
        cy.contains("bbuser").should('be.visible')
    })
})
