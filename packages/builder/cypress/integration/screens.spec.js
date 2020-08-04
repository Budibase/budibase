
context('Screen Tests', () => {
    before(() => {
        cy.visit('localhost:4001/_builder')
        cy.createApp('Conor Cy App', 'Model App Description')
        cy.navigateToFrontend()
    })

    it('Should successful create a screen', () => { 
        cy.createScreen("test Screen", "/test")        
    })

    it('Should rename a screen', () => {
        cy.get(".components-pane").within(() => {
            cy.contains("Settings").click()
            cy.get("input[name=_instanceName]").clear().type("About Us").blur()
        })
        cy.get('.nav-items-container').within(() => {
            cy.contains("About Us").should('exist')
        })
    })
})