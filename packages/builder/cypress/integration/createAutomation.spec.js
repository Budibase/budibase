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
    cy.get("input").type("Add Record")
    cy.contains("Save").click()

    // Add trigger
    cy.get("[data-cy=add-automation-component]").click()
    cy.get("[data-cy=RECORD_SAVED]").click()
    cy.get("[data-cy=automation-block-setup]").within(() => {
      cy.get("select")
        .first()
        .select("dog")
    })

    // Create action
    cy.get("[data-cy=SAVE_RECORD]").click()
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
    cy.contains("Add Record").should("be.visible")
    cy.get(".stop-button.highlighted").should("be.visible")
  })

  it("should add record when a new record is added", () => {
    cy.contains("backend").click()
    cy.addRecord(["Rover", 15])
    cy.reload()
    cy.contains("goodboy").should("have.text", "goodboy")
  })
})
