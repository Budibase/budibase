context("Create a automation", () => {
  before(() => {
    cy.login()
    cy.createTestApp()
  })

  // https://on.cypress.io/interacting-with-elements
  it("should create a automation", () => {
    cy.createTestTableWithData()

    cy.contains("Automate").click()
    cy.get("[data-cy='new-screen'] > .spectrum-Icon").click()
    cy.get(".spectrum-Dialog-grid").within(() => {
      cy.get("input").type("Add Row")
      cy.get(".spectrum-Button--cta").click()
    })

    // Add trigger
    cy.contains("Trigger").click()
    cy.contains("Row Created").click()
    cy.get(".setup").within(() => {
      cy.get(".spectrum-Picker-label").click()
      cy.contains("dog").click()
    })

    // Create action
    cy.contains("Action").click()
    cy.contains("Create Row").click()
    cy.get(".setup").within(() => {
      cy.get(".spectrum-Picker-label").click()
      cy.contains("dog").click()
      cy.get(".spectrum-Textfield-input")
        .first()
        .type("goodboy")
      cy.get(".spectrum-Textfield-input")
        .eq(1)
        .type("11")
    })

    // Save
    cy.contains("Save Automation").click()

    // Activate Automation
    cy.get("[data-cy=activate-automation]").click()
  })

  it("should add row when a new row is added", () => {
    cy.contains("Data").click()
    cy.addRow(["Rover", 15])
    cy.reload()
    cy.contains("goodboy").should("have.text", "goodboy")
  })
})
