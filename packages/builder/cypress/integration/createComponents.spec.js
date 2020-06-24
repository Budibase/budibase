context('Create Components', () => {

    before(() => {
        cy.visit('localhost:4001/_builder')
        // https://on.cypress.io/type
        cy.createApp('Model App', 'Model App Description')
        cy.createModel('dog', 'name', 'age')
        cy.addRecord('bob', '15')
    })

    // https://on.cypress.io/interacting-with-elements
    it('should add a container', () => {
        cy.contains('frontend').click()
        cy.get('.switcher > :nth-child(2)').click()

        cy.contains('Container').click()
    })
    it('should add a headline', () => {
        cy.addHeadlineComponent('An Amazing headline!')

        getIframeBody().contains('An Amazing headline!')
    })
    it('change the font size of the headline', () => {
        cy.contains('Typography').click()
        cy.get('input[name="font-size"]')
            .type('60px')
        cy.contains('Design').click()

        getIframeBody().contains('An Amazing headline!').should('have.css', 'font-size', '60px')
    })
})

const getIframeDocument = () => {
    return cy
        .get('iframe')
        // Cypress yields jQuery element, which has the real
        // DOM element under property "0".
        // From the real DOM iframe element we can get
        // the "document" element, it is stored in "contentDocument" property
        // Cypress "its" command can access deep properties using dot notation
        // https://on.cypress.io/its
        .its('0.contentDocument').should('exist')
}

const getIframeBody = () => {
    // get the document
    return getIframeDocument()
        // automatically retries until body is loaded
        .its('body').should('not.be.undefined')
        // wraps "body" DOM element to allow
        // chaining more Cypress commands, like ".find(...)"
        .then(cy.wrap)
}