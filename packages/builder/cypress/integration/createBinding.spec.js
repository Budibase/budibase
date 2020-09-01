context('Create a Binding', () => {
    before(() => {
        cy.visit('localhost:4001/_builder')
        cy.createApp('Binding App', 'Binding App Description')
        cy.createTable('dog')
        cy.addColumn('dog', 'name', 'Plain Text')
        cy.addRecord(["Rover"])
        cy.navigateToFrontend()
    })

    it('add an input binding', () => {
        cy.get(".nav-items-container").contains('Home').click()
        cy.contains("Add").click()
        cy.get("[data-cy=Input]").click()
        cy.get("[data-cy=Textfield]").click()
        cy.contains("Heading").click()
        cy.get("[data-cy=text-binding-button]").click()
        cy.get("[data-cy=binding-dropdown-modal]").contains('Input 1').click()
        cy.contains('Home{{ Input 1 }}')

    })
})
