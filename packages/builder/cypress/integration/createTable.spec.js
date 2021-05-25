context("Create a Table", () => {
  before(() => {
    cy.login()
    cy.createTestApp()
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
    cy.get(".title").click()
    cy.get(".spectrum-Table-editIcon > use").click()
    cy.get("input")
      .eq(1)
      .type("updated", { force: true })
    // Unset table display column
    cy.get(".spectrum-Switch-input").eq(1).click()
    cy.contains("Save Column").click()
    cy.contains("nameupdated ").should("contain", "nameupdated")
  })

  it("edits a row", () => {
    cy.contains("button", "Edit").click({ force: true })
    cy.wait(1000)
    cy.get(".spectrum-Modal input").type("Updated")
    cy.contains("Save").click()
    cy.contains("RoverUpdated").should("have.text", "RoverUpdated")
  })

  it("deletes a row", () => {
    cy.get(".spectrum-Checkbox-input").check({ force: true })
    cy.contains("Delete 1 row(s)").click()
    cy.get(".spectrum-Modal")
      .contains("Delete")
      .click()
    cy.contains("RoverUpdated").should("not.exist")
  })

  it("deletes a column", () => {
    cy.get(".title").click()
    cy.get(".spectrum-Table-editIcon > use").click()
    cy.contains("Delete").click()
    cy.wait(50)
    cy.contains("Delete Column")
      .click()
    cy.contains("nameupdated").should("not.exist")
  })

  it("deletes a table", () => {
    cy.get(".ri-more-line")
      .first()
      .click({ force: true })
    cy.get("[data-cy=delete-table]").click()
    cy.contains("Delete Table").click()
    cy.contains("dog").should("not.exist")
  })
})
