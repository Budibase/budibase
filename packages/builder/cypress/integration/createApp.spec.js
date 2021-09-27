context("Create an Application", () => {
  it("should create a new application", () => {
    cy.login()
    cy.createTestApp()
    cy.visit(`https://test.budi.live/builder`)
    cy.contains("Cypress Tests").should("exist")
  })
})
