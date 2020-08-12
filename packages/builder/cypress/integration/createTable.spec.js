context('Create a Table', () => {
    before(() => {
        cy.visit('localhost:4001/_builder')
        cy.createApp('Table App', 'Table App Description')
    })

    it('should create a new Table', () => {
        cy.createTable('dog')

        // Check if Table exists
        cy.get('.title').should('have.text', 'dog')
    })

    it('adds a new column to the table', () => {
        cy.addColumn('dog', 'name', 'Plain Text')

        cy.contains('name').should("be.visible")
    })

    it('creates a record in the table', () => {
        cy.addRecord(["Rover"])

        cy.contains('Rover').should("be.visible")
    })

    it('updates a column on the table', () => {
        cy.contains("name").click()
        cy.get("[data-cy='edit-column-header']").click()

        cy.get("[placeholder=Name]").type("updated")
        cy.get("select").select("Plain Text")

        cy.contains("Save Column").click()

        cy.contains('nameupdated').should('have.text', 'nameupdated ')
    })

    it('edits a record', () => {
        cy.get("tbody .ri-more-line").click()
        cy.get("[data-cy=edit-row]").click()
        cy.get(".actions input").type("updatedRecord")
        cy.contains("Save").click()

        cy.contains('updatedRecord').should('have.text', 'updatedRecord')
    })

    it('deletes a record', () => {
        cy.get("tbody .ri-more-line").click()
        cy.get("[data-cy=delete-row]").click()
        cy.get(".modal-actions").contains("Delete").click()

        cy.contains('updatedRecord').should('not.exist')
    })

    it('deletes a column', () => {
        cy.contains("name").click()
        cy.get("[data-cy='delete-column-header']").click()

        cy.contains('nameupdated').should('not.exist')
    })

    it('deletes a table', () => {
        cy.contains("div", "dog").get(".ri-more-line").click()
        cy.get("[data-cy=delete-table]").click()
        cy.get(".modal-actions").contains("Delete").click()

        cy.contains('dog').should('not.exist')
    })

})
