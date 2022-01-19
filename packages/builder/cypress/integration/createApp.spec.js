context("Create an Application", () => {
  it("should create a new application", () => {
    cy.login()
    cy.createTestApp()
    cy.visit(`localhost:${Cypress.env("PORT")}/builder`)
    cy.contains("Cypress Tests").should("exist")
  })
})
