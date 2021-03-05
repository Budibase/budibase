context("Create an Application", () => {
  beforeEach(() => {
    cy.server()
    cy.visit(`localhost:${Cypress.env("PORT")}/_builder`)
  })

  it("should create a new application", () => {
    cy.createApp("My Cool App", "This is a description")
    cy.visit(`localhost:${Cypress.env("PORT")}/_builder`)
    cy.contains("My Cool App").should("exist")
  })
})
