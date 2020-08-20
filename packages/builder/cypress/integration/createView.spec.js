context('Create a View', () => {
    before(() => {
        cy.visit('localhost:4001/_builder')
        cy.createApp('View App', 'View App Description')
        cy.createTable('data')
        cy.addColumn('data', 'group', 'Plain Text')
        cy.addColumn('data', 'age', 'Number')
        cy.addColumn('data', 'rating', 'Number')

        cy.addRecord(["Students", 25, 1])
        cy.addRecord(["Students", 20, 3])
        cy.addRecord(["Students", 18, 6])
        cy.addRecord(["Students", 25, 2])
        cy.addRecord(["Teachers", 49, 5])
        cy.addRecord(["Teachers", 36, 3])
    })


    it('creates a stats view based on age', () => {
      cy.contains("Create New View").click()
      cy.get("[placeholder='View Name']").type("Test View")
      cy.contains("Save View").click()
      cy.get("thead th").should(($headers) => {
        expect($headers).to.have.length(7)
        const headers = $headers.map((i, header) => Cypress.$(header).text())
        expect(headers.get()).to.deep.eq([
          "group",
          "sum",
          "min",
          "max",
          "sumsqr",
          "count",
          "avg",
        ])
      })
      cy.get("tbody td").should(($values) => {
        const values = $values.map((i, value) => Cypress.$(value).text())
        expect(values.get()).to.deep.eq([
          "null",
          "173",
          "18",
          "49",
          "5671",
          "6",
          "28.833333333333332"
        ])
      })
    })

    it('groups the stats view by group', () => {
      cy.contains("Group By").click()
      cy.get("select").select("group")
      cy.contains("Save").click()
      cy.contains("Students").should("be.visible")
      cy.contains("Teachers").should("be.visible")

      cy.get("tbody tr").first().find("td").should(($values) => {
        const values = $values.map((i, value) => Cypress.$(value).text())
        expect(values.get()).to.deep.eq([
          "Students",
          "88",
          "18",
          "25",
          "1974",
          "4",
          "22"
        ])
      })
    })

    it('renames a view', () => {
      cy.contains("[data-cy=model-nav-item]", "Test View").find(".ri-more-line").click()
      cy.contains("Edit").click()
      cy.get("[placeholder='View Name']").type(" Updated")
      cy.contains("Save").click()
      cy.contains("Test View Updated").should("be.visible")
    })

    it('deletes a view', () => {
      cy.contains("[data-cy=model-nav-item]", "Test View Updated").find(".ri-more-line").click()
      cy.contains("Delete").click()
      cy.get(".content").contains("button", "Delete").click()
      cy.contains("TestView Updated").should("not.be.visible")
    })
})
