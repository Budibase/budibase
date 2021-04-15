context("Screen Tests", () => {
  before(() => {
    cy.login()
    cy.createTestApp()
    cy.navigateToFrontend()
  })

  it("Should successfully create a screen", () => {
    cy.createScreen("Test Screen", "/test")
  })
})
