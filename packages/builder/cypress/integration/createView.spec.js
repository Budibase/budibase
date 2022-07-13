import filterTests from "../support/filterTests"
const interact = require('../support/interact')

filterTests(['smoke', 'all'], () => {
  context("Create a View", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
      cy.createTable("data")
      cy.addColumn("data", "group", "Text")
      cy.addColumn("data", "age", "Number")
      cy.addColumn("data", "rating", "Number")

      // 6 Rows
      cy.addRow(["Students", 25, 1])
      cy.addRow(["Students", 20, 3])
      cy.addRow(["Students", 18, 6])
      cy.addRow(["Students", 25, 2])
      cy.addRow(["Teachers", 49, 5])
      cy.addRow(["Teachers", 36, 3])
    })

    it("creates a view", () => {
      cy.contains("Create view").click()
      cy.get(interact.MODAL_INNER_WRAPPER).within(() => {
        cy.get("input").type("Test View")
        cy.get("button").contains("Create View").click({ force: true })
      })
      cy.get(interact.TABLE_TITLE_H1).contains("Test View")
      cy.get(interact.TITLE).then($headers => {
        expect($headers).to.have.length(3)
        const headers = Array.from($headers).map(header =>
          header.textContent.trim()
        )
        expect(removeSpacing(headers)).to.deep.eq(["group", "age", "rating"])
      })
    })

    it("filters the view by age over 10", () => {
      cy.contains("Filter").click()
      cy.contains("Add Filter").click()

      cy.get(interact.MODAL_INNER_WRAPPER).within(() => {
        cy.get(interact.SPECTRUM_PICKER_LABEL).eq(0).click()
        cy.contains("age").click({ force: true })

        cy.get(interact.SPECTRUM_PICKER_LABEL).eq(1).click()
        cy.contains("More Than").click({ force: true })

        cy.get("input").type(18)
        cy.contains("Save").click()
      })

      cy.get(interact.SPECTRUM_TABLE_ROW).get($values => {
        expect($values).to.have.length(5)
      })
    })

    it("creates a stats calculation view based on age", () => {
      cy.wait(1000)
      cy.contains("Calculate").click()
      cy.get(interact.MODAL_INNER_WRAPPER).within(() => {
        cy.get(interact.SPECTRUM_PICKER_LABEL).eq(0).click()
        cy.contains("Statistics").click()

        cy.get(interact.SPECTRUM_PICKER_LABEL).eq(1).click()
        cy.contains("age").click({ force: true })

        cy.get(interact.SPECTRUM_BUTTON).contains("Save").click({ force: true })
      })

      cy.wait(1000)
      cy.get(interact.TITLE).then($headers => {
        expect($headers).to.have.length(7)
        const headers = Array.from($headers).map(header =>
          header.textContent.trim()
        )
        expect(removeSpacing(headers)).to.deep.eq([
          "field",
          "sum",
          "min",
          "max",
          "count",
          "sumsqr",
          "avg",
        ])
      })
      cy.get(interact.SPECTRUM_TABLE_CELL).then($values => {
        let values = Array.from($values).map(header => header.textContent.trim())
        expect(values).to.deep.eq(["age", "155", "20", "49", "5", "5347", "31"])
      })
    })

    it("groups the view by group", () => {
      cy.contains("Group by").click()
      cy.get(interact.MODAL_INNER_WRAPPER).within(() => {
        cy.get(interact.SPECTRUM_PICKER_LABEL).eq(0).click()
        cy.contains("group").click()
        cy.contains("Save").click()
      })
      cy.wait(1000)
      cy.contains("Students").should("be.visible")
      cy.contains("Teachers").should("be.visible")

      cy.get(interact.SPECTRUM_TABLE_CELL).then($values => {
        let values = Array.from($values).map(header => header.textContent.trim())
        expect(values).to.deep.eq([
          "Students",
          "70",
          "20",
          "25",
          "3",
          "1650",
          "23.333333333333332",
          "Teachers",
          "85",
          "36",
          "49",
          "2",
          "3697",
          "42.5",
        ])
      })
    })

    it("renames a view", () => {
      cy.contains(interact.NAV_ITEM, "Test View")
        .find(".actions .icon.open-popover")
        .click({ force: true })
      cy.get(interact.SPECTRUM_MENU_ITEM_LABEL).contains("Edit").click()
      cy.get(interact.MODAL_INNER_WRAPPER).within(() => {
        cy.get("input").type(" Updated")
        cy.contains("Save").click()
      })
      cy.wait(1000)
      cy.contains("Test View Updated").should("be.visible")
    })

    it("deletes a view", () => {
      cy.contains(interact.NAV_ITEM, "Test View Updated")
        .find(".actions .icon.open-popover")
        .click({ force: true })
      cy.contains("Delete").click()
      cy.contains("Delete View").click()
      cy.wait(500)
      cy.contains("TestView Updated").should("not.exist")
    })
  })

  function removeSpacing(headers) {
    let newHeaders = []
    for (let header of headers) {
      newHeaders.push(header.replace(/\s\s+/g, " "))
    }
    return newHeaders
  }
})
