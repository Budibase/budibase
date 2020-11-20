
context('Screen Tests', () => {
    before(() => {
        cy.server()
        cy.visit('localhost:4001/_builder')
        cy.createApp('Conor Cy App', 'Table App Description')
        cy.navigateToFrontend()
    })

    it('Should successfully create a screen', () => { 
        cy.createScreen("test Screen", "/test")        
    })
})