context("Create an Application", () => {
  it("should create a new application", () => {
    cy.createTestApp()
    cy.visit(`localhost:${Cypress.env("PORT")}/_builder`)
    cy.contains("Cypress Tests").should("exist")
  })
})
