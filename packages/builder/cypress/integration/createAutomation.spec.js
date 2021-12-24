context("Create a automation", () => {
  before(() => {
    cy.login()
    cy.createTestApp()
  })

  it("should create a automation", () => {
    cy.createTestTableWithData()
    cy.wait(2000)
    cy.contains("Automate").click()
    cy.get("[data-cy='new-screen'] > .spectrum-Icon").click()
    cy.get(".modal-inner-wrapper").within(() => {
      cy.get("input").type("Add Row")
      cy.contains("Row Created").click()
      cy.wait(500)
      cy.get(".spectrum-Button--cta").click()
    })

    // Setup trigger
    cy.contains("Setup").click()
    cy.get(".spectrum-Picker-label").click()
    cy.wait(500)
    cy.contains("dog").click()

    // Create action
    cy.get('[aria-label="AddCircle"]').eq(1).click()
    cy.get(".modal-inner-wrapper").within(() => {
      cy.wait(1000)
      cy.contains("Create Row").trigger('mouseover').click().click()
      cy.get(".spectrum-Button--cta").click()
    })
    cy.contains("Setup").click()
    cy.get(".spectrum-Picker-label").click()
    cy.contains("dog").click()
    cy.get(".spectrum-Textfield-input")
    .first()
    .type("goodboy")
    cy.get(".spectrum-Textfield-input")
      .eq(1)
      .type("11")

    cy.contains("Run test").click()
    cy.get(".modal-inner-wrapper").within(() => {
      cy.wait(1000)
      cy.get(".spectrum-Picker-label").click()
      cy.contains("dog").click()
      cy.get(".spectrum-Textfield-input")
        .first()
        .type("goodboy")
      cy.get(".spectrum-Textfield-input")
        .eq(1)
        .type("11")
      cy.get(".spectrum-Textfield-input")
        .eq(2)
        .type("123456")
      cy.get(".spectrum-Textfield-input")
        .eq(3)
        .type("123456")
    })
  })
})
