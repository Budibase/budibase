context("Create a Table", () => {
  before(() => {
    cy.visit("localhost:4001/_builder")
    cy.createApp("Table App", "Table App Description")
  })

  it("should create a new Table", () => {
    cy.createTable("dog")

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
    cy.contains("header", "name")
      .trigger("mouseover")
      .find(".ri-pencil-line")
      .click({ force: true })
    cy.get(".actions input").first().type("updated")
    // Unset table display column
    cy.contains("display column").click()
    cy.contains("Save Column").click()
    cy.contains("nameupdated").should("have.text", "nameupdated")
  })

  it("edits a row", () => {
    cy.contains("button", "Edit").click({ force: true })
    cy.wait(1000)
    cy.get(".modal input").type("Updated")
    cy.contains("Save").click()
    cy.contains("RoverUpdated").should("have.text", "RoverUpdated")
  })

  it("deletes a row", () => {
    cy.get(".ag-checkbox-input").check({ force: true })
    cy.contains("Delete 1 row(s)").click()
    cy.get(".modal").contains("Delete").click()
    cy.contains("RoverUpdated").should("not.exist")
  })

  it("deletes a column", () => {
    cy.contains("header", "name")
      .trigger("mouseover")
      .find(".ri-pencil-line")
      .click({ force: true })
    cy.contains("Delete").click()
    cy.wait(50)
    cy.get(".buttons").contains("Delete").click()
    cy.contains("nameupdated").should("not.exist")
  })

  it("deletes a table", () => {
    cy.get(".actions").first().invoke("show").click({ force: true })
    cy.get("[data-cy=delete-table]").click()
    cy.contains("Delete Table").click()
    cy.contains("dog").should("not.exist")
  })
})
