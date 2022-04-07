import filterTests from "../support/filterTests"

filterTests(["smoke", "all"], () => {
  context("Create a Table", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
    })

    it("should create a new Table", () => {
      cy.createTable("dog")
      cy.wait(1000)
      // Check if Table exists
      cy.get(".table-title h1").should("have.text", "dog")
    })

    it("adds a new column to the table", () => {
      cy.addColumn("dog", "name", "Text")
      cy.contains("name").should("be.visible")
    })

    it("creates a row in the table", () => {
      cy.addRow(["Rover"])
      cy.contains("Rover").should("be.visible")
    })

    it("updates a column on the table", () => {
      cy.get(".title").click()
      cy.get(".spectrum-Table-editIcon > use").click()
      cy.get(".modal-inner-wrapper").within(() => {

      cy.get("input").eq(0).type("updated", { force: true })
      // Unset table display column
      cy.get(".spectrum-Switch-input").eq(1).click()
      cy.contains("Save Column").click()
      })
      cy.contains("nameupdated ").should("contain", "nameupdated")
    })

    it("edits a row", () => {
      cy.contains("button", "Edit").click({ force: true })
      cy.wait(1000)
      cy.get(".spectrum-Modal input").clear()
      cy.get(".spectrum-Modal input").type("Updated")
      cy.contains("Save").click()
      cy.contains("Updated").should("have.text", "Updated")
    })

    it("deletes a row", () => {
      cy.get(".spectrum-Checkbox-input").check({ force: true })
      cy.contains("Delete 1 row(s)").click()
      cy.get(".spectrum-Modal").contains("Delete").click()
      cy.contains("RoverUpdated").should("not.exist")
    })

    if (Cypress.env("TEST_ENV")) {
      // No Pagination in CI - Test env only for the next two tests
      it("Adds 15 rows and checks pagination", () => {
        // 10 rows per page, 15 rows should create 2 pages within table
        const totalRows = 16
        for (let i = 1; i < totalRows; i++) {
          cy.addRow([i])
        }
        cy.wait(1000)
        cy.get(".spectrum-Pagination").within(() => {
          cy.get(".spectrum-ActionButton").eq(1).click()
        })
        cy.get(".spectrum-Pagination").within(() => {
          cy.get(".spectrum-Body--secondary").contains("Page 2")
        })
      })

      it("Deletes rows and checks pagination", () => {
        // Delete rows, removing second page of rows from table
        const deleteRows = 5
        cy.get(".spectrum-Checkbox-input").check({ force: true })
        cy.get(".spectrum-Table")
        cy.contains("Delete 5 row(s)").click()
        cy.get(".spectrum-Modal").contains("Delete").click()
        cy.wait(1000)

        // Confirm table only has one page
        cy.get(".spectrum-Pagination").within(() => {
          cy.get(".spectrum-ActionButton").eq(1).should("not.be.enabled")
        })
      })
    }

    it("deletes a column", () => {
      const columnName = "nameupdated"
      cy.get(".title").click()
      cy.get(".spectrum-Table-editIcon > use").click()
      cy.contains("Delete").click()
      cy.get('[data-cy="delete-column-confirm"]').type(columnName)
      cy.contains("Delete Column").click()
      cy.contains("nameupdated").should("not.exist")
    })

    it("deletes a table", () => {
      cy.get(".nav-item")
        .contains("dog")
        .parents(".nav-item")
        .first()
        .within(() => {
          cy.get(".actions .spectrum-Icon").click({ force: true })
        })
      cy.get(".spectrum-Menu > :nth-child(2)").click()
      cy.get('[data-cy="delete-table-confirm"]').type("dog")
      cy.contains("Delete Table").click()
      cy.contains("dog").should("not.exist")
    })
  })
})
