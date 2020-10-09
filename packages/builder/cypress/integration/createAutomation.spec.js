context("Create a automation", () => {
  before(() => {
    cy.server()
    cy.visit("localhost:4001/_builder")

    cy.createApp(
      "Automation Test App",
      "This app is used to test that automations do in fact work!"
    )
  })

  // https://on.cypress.io/interacting-with-elements
  it("should create a automation", () => {
    cy.createTestTableWithData()

    cy.contains("automate").click()
    cy.contains("Create New Automation").click()
    cy.get(".modal").within(() => {
      cy.get("input").type("Add Row")
      cy.get(".buttons")
        .contains("Create")
        .click()
    })

    // Add trigger
    cy.get("[data-cy=add-automation-component]").click()
    cy.get("[data-cy=ROW_SAVED]").click()
    cy.get("[data-cy=automation-block-setup]").within(() => {
      cy.get("select")
        .first()
        .select("dog")
    })

    // Create action
    cy.get("[data-cy=CREATE_ROW]").click()
    cy.get("[data-cy=automation-block-setup]").within(() => {
      cy.get("select")
        .first()
        .select("dog")
      cy.get("input")
        .first()
        .type("goodboy")
      cy.get("input")
        .eq(1)
        .type("11")
    })

    // Save
    cy.contains("Save Automation").click()

    // Activate Automation
    cy.get("[data-cy=activate-automation]").click()
    cy.get(".stop-button.highlighted").should("be.visible")
  })

  it("should add row when a new row is added", () => {
    cy.contains("backend").click()
    cy.addRow(["Rover", 15])
    cy.reload()
    cy.contains("goodboy").should("have.text", "goodboy")
  })
})
