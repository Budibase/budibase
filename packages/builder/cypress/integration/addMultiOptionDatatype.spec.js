import filterTests from "../support/filterTests"

filterTests(['all'], () => {
  context("Add Multi-Option Datatype", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
    })

    it("should create a new table, with data", () => {
      cy.createTable("Multi Data")
      cy.addColumn("Multi Data", "Test Data", "Multi-select", "1\n2\n3\n4\n5")
      cy.addRowMultiValue(["1", "2", "3", "4", "5"])
    })

  it("should add form with multi select picker, containing 5 options", () => {
    cy.navigateToFrontend()
    cy.wait(500)
    // Add data provider
    cy.get(`[data-cy="category-Data"]`).click()
    cy.get(`[data-cy="component-Data Provider"]`).click()
    cy.get('[data-cy="dataSource-prop-control"]').click()
    cy.get(".dropdown").contains("Multi Data").click()
    cy.wait(500)
    // Add Form with schema to match table
    cy.addComponent("Form", "Form")
    cy.get('[data-cy="dataSource-prop-control"').click()
    cy.get(".dropdown").contains("Multi Data").click()
    cy.wait(500)
    // Add multi-select picker to form
    cy.addComponent("Form", "Multi-select Picker").then(componentId => {
      cy.get('[data-cy="field-prop-control"]').type("Test Data").type("{enter}")
      cy.wait(1000)
      cy.getComponent(componentId).contains("Choose some options").click()
      // Check picker has 5 items
      cy.getComponent(componentId).find("li").should("have.length", 5)
      // Select all items
      for (let i = 1; i < 6; i++) {
        cy.getComponent(componentId).find("li").contains(i).click()
      }
      // Check items have been selected
      cy.getComponent(componentId)
        .find(".spectrum-Picker-label")
        .contains("(5)")
      })
    })
  })
})
