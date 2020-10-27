context("Create a View", () => {
  before(() => {
    cy.visit("localhost:4001/_builder")
    cy.createApp("View App", "View App Description")
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
    cy.contains("Create New View").click()
    cy.get(".menu-container").within(() => {
      cy.get("input").type("Test View")
      cy.contains("Save View").click()
    })
    cy.get(".table-title h1").contains("Test View")
    cy.get("thead th div").should($headers => {
      expect($headers).to.have.length(3)
      const headers = $headers.map((i, header) => Cypress.$(header).text())
      expect(headers.get()).to.deep.eq(["group", "age", "rating"])
    })
  })

  it("filters the view by age over 10", () => {
    cy.contains("Filter").click()
    cy.contains("Add Filter").click()
    cy.get(".menu-container").find("select").first().select("age")
    cy.get(".menu-container").find("select").eq(1).select("More Than")
    cy.get("input").type(18)
    cy.contains("Save").click()
    cy.get("tbody tr").should($values => {
      expect($values).to.have.length(5)
    })
  })

  it("creates a stats calculation view based on age", () => {
    cy.contains("Calculate").click()
    // we may reinstate this - have commented this dropdown for now as there is only one option
    //cy.get(".menu-container").find("select").first().select("Statistics")
    cy.get(".menu-container").find("select").eq(0).select("Statistics")
    cy.wait(50)
    cy.get(".menu-container").find("select").eq(1).select("age")
    cy.contains("Save").click()
    cy.get("thead th div").should($headers => {
      expect($headers).to.have.length(7)
      const headers = $headers.map((i, header) => Cypress.$(header).text())
      expect(headers.get()).to.deep.eq([
        "field",
        "sum",
        "min",
        "max",
        "count",
        "sumsqr",
        "avg",
      ])
    })
    cy.get("tbody td").should($values => {
      const values = $values.map((i, value) => Cypress.$(value).text())
      expect(values.get()).to.deep.eq([
        "age",
        "155",
        "20",
        "49",
        "5",
        "5347",
        "31",
      ])
    })
  })

  it("groups the view by group", () => {
    cy.contains("Group By").click()
    cy.get("select").select("group")
    cy.contains("Save").click()
    cy.contains("Students").should("be.visible")
    cy.contains("Teachers").should("be.visible")

    cy.get("tbody tr")
      .first()
      .find("td")
      .should($values => {
        const values = $values.map((i, value) => Cypress.$(value).text())
        expect(values.get()).to.deep.eq([
          "Students",
          "70",
          "20",
          "25",
          "3",
          "1650",
          "23.333333333333332",
        ])
      })
  })

  it("renames a view", () => {
    cy.contains(".nav-item", "Test View")
      .find(".actions")
      .invoke("show")
      .click()
    cy.get("[data-cy=edit-view]").click()
    cy.get(".menu-container").within(() => {
      cy.get("input").type(" Updated")
      cy.contains("Save").click()
    })
    cy.contains("Test View Updated").should("be.visible")
  })

  it("deletes a view", () => {
    cy.contains(".nav-item", "Test View Updated")
      .find(".actions")
      .invoke("show")
      .click()
    cy.get("[data-cy=delete-view]").click()
    cy.contains("Delete View").click()
    cy.contains("TestView Updated").should("not.be.visible")
  })
})
