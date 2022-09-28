import filterTests from "../support/filterTests"
const interact = require('../support/interact')

filterTests(["smoke", "all"], () => {
  context("Create a Table", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
    })

    it("should create a new Table", () => {
      cy.createTable("dog")
      // Check if Table exists
      cy.get(interact.TABLE_TITLE_H1, { timeout: 1000 }).should("have.text", "dog")
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
      cy.get(interact.TABLE_TITLE).click()
      cy.get(interact.SPECTRUM_TABLE_EDIT).click()
      cy.get(interact.MODAL_INNER_WRAPPER).within(() => {

      cy.get("input").eq(0).type("updated", { force: true })
      // Unset table display column
      cy.get(interact.SPECTRUM_SWITCH_INPUT).eq(1).click()
      cy.contains("Save Column").click()
      })
      cy.contains("nameupdated ").should("contain", "nameupdated")
    })

    it("edits a row", () => {
      cy.contains("button", "Edit").click({ force: true })
      cy.wait(500)
      cy.get(interact.SPECTRUM_MODAL_INPUT).clear()
      cy.get(interact.SPECTRUM_MODAL_INPUT).type("Updated")
      cy.contains("Save").click()
      cy.contains("Updated").should("have.text", "Updated")
    })

    it("deletes a row", () => {
      cy.get(interact.SPECTRUM_CHECKBOX_INPUT).check({ force: true })
      cy.contains("Delete 1 row").click()
      cy.get(interact.SPECTRUM_MODAL).contains("Delete").click()
      cy.contains("RoverUpdated").should("not.exist")
    })

    if (Cypress.env("TEST_ENV")) {
      // No Pagination in CI - Test env only for the next two tests
      xit("Adds 15 rows and checks pagination", () => {
        // 10 rows per page, 15 rows should create 2 pages within table
        const totalRows = 16
        for (let i = 1; i < totalRows; i++) {
          cy.addRow([i])
        }
        cy.reload()
        cy.get(interact.SPECTRUM_PAGINATION, { timeout: 2000 }).within(() => {
          cy.get(interact.SPECTRUM_ACTION_BUTTON).eq(1).click()
        })
        cy.get(interact.SPECTRUM_PAGINATION).within(() => {
          cy.get(interact.SPECTRUM_BODY_SECOND).contains("Page 2")
        })
      })

      xit("Deletes rows and checks pagination", () => {
        // Delete rows, removing second page from table
        cy.get(interact.SPECTRUM_CHECKBOX_INPUT).check({ force: true })
        cy.get(interact.POPOVERS).within(() => {
          cy.get(interact.SPECTRUM_BUTTON).click({ force: true })
        })
        cy.get(interact.SPECTRUM_DIALOG_GRID).contains("Delete").click({ force: true })

        // Confirm table only has one page
        cy.get(interact.SPECTRUM_PAGINATION, { timeout: 1000 }).within(() => {
          cy.get(interact.SPECTRUM_ACTION_BUTTON).eq(1).should("not.be.enabled")
        })
      })
    }

    it("deletes a column", () => {
      const columnName = "nameupdated"
      cy.get(interact.TABLE_TITLE).click()
      cy.get(interact.SPECTRUM_TABLE_EDIT).click()
      cy.contains("Delete").click()
      cy.get(interact.DELETE_COLUMN_CONFIRM).type(columnName)
      cy.contains("Delete Column").click()
      cy.contains("nameupdated").should("not.exist")
    })

    it("deletes a table", () => {
      cy.get(interact.NAV_ITEM)
        .contains("dog")
        .parents(interact.NAV_ITEM)
        .first()
        .within(() => {
          cy.get(interact.ACTION_SPECTRUM_ICON).click({ force: true })
        })
      cy.get(interact.SPECTRUM_MENU_CHILD2).click()
      cy.get(interact.DELETE_TABLE_CONFIRM).type("dog")
      cy.contains("Delete Table").click()
      cy.contains("dog").should("not.exist")
    })
  })
})
