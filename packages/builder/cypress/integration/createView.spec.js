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
    cy.get(".spectrum-Dialog-grid").within(() => {
      cy.get("input").type("Test view")
      cy.get(".spectrum-Button--cta").click()
    })
    cy.get(".table-title h1").contains("Test view")
    cy.get("[data-cy=table-header]").then($headers => {
      expect($headers).to.have.length(3)
      const headers = Array.from($headers).map(header =>
        header.textContent.trim()
      )
      expect(removeSpacing(headers)).to.deep.eq([
        "rating Number",
        "age Number",
        "group Text",
      ])
    })
  })

  it("filters the view by age over 10", () => {
    cy.contains("Filter").click()
    cy.contains("Add Filter").click()

    cy.get(".spectrum-Picker-label").eq(0).click()
    cy.contains("age").click()

    cy.get(".spectrum-Picker-label").eq(1).click()
    cy.contains("More Than").click()

    cy.get(".spectrum-Picker-label").eq(2).click()
    cy.contains("More Than").click()
    // cy.get(".menu-container")
    //   .find("select")
    //   .first()
    //   .select("age")
    // cy.get(".menu-container")
    //   .find("select")
    //   .eq(1)
    //   .select("More Than")
    cy.get(".menu-container")
      .find("input")
      .type(18)
    cy.contains("Save").click()
    cy.get("[role=rowgroup] .ag-row").get($values => {
      expect($values).to.have.length(5)
    })
  })

  it("creates a stats calculation view based on age", () => {
    // Required due to responsive bug with ag grid in cypress
    cy.viewport("macbook-15")

    cy.contains("Calculate").click()
    cy.get(".spectrum-Picker-label").eq(0).click()
    cy.contains("Statistics").click()
    
    cy.get(".spectrum-Picker-label").eq(1).click()
    cy.contains("age").click()

    cy.contains("Save").click()
    cy.wait(1000)
    cy.get(".ag-center-cols-viewport").scrollTo("100%")
    cy.get("[data-cy=table-header]").then($headers => {
      expect($headers).to.have.length(7)
      const headers = Array.from($headers).map(header =>
        header.textContent.trim()
      )
      expect(removeSpacing(headers)).to.deep.eq([
        "avg Number",
        "sumsqr Number",
        "count Number",
        "max Number",
        "min Number",
        "sum Number",
        "field Text",
      ])
    })
    cy.get(".ag-cell").then($values => {
      let values = Array.from($values).map(header => header.textContent.trim())
      expect(values).to.deep.eq(["31", "5347", "5", "49", "20", "155", "age"])
    })
  })

  it("groups the view by group", () => {
    // Required due to responsive bug with ag grid in cypress
    cy.viewport("macbook-15")

    cy.contains("Group By").click()
    cy.get("select").select("group")
    cy.contains("Save").click()
    cy.wait(1000)
    cy.get(".ag-center-cols-viewport").scrollTo("100%")
    cy.contains("Students").should("be.visible")
    cy.contains("Teachers").should("be.visible")

    cy.get(".ag-row[row-index=0]")
      .find(".ag-cell")
      .then($values => {
        const values = Array.from($values).map(value => value.textContent)
        expect(values.sort()).to.deep.eq(
          [
            "Students",
            "23.333333333333332",
            "1650",
            "3",
            "25",
            "20",
            "70",
          ].sort()
        )
      })
  })

  it("renames a view", () => {
    cy.contains(".nav-item", "Test view")
      .find(".ri-more-line")
      .click({ force: true })
    cy.get("[data-cy=edit-view]").click()
    cy.get(".menu-container").within(() => {
      cy.get("input").type(" Updated")
      cy.contains("Save").click()
    })
    cy.wait(1000)
    cy.contains("Test view Updated").should("be.visible")
  })

  it("deletes a view", () => {
    cy.contains(".nav-item", "Test view Updated")
      .find(".ri-more-line")
      .click({ force: true })
    cy.get("[data-cy=delete-view]").click()
    cy.contains("Delete View").click()
    cy.wait(1000)
    cy.contains("TestView Updated").should("not.be.visible")
  })
})

function removeSpacing(headers) {
  let newHeaders = []
  for (let header of headers) {
    newHeaders.push(header.replace(/\s\s+/g, " "))
  }
  return newHeaders
}
