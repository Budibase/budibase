context("Screen Tests", () => {
  before(() => {
    cy.createTestApp()
    cy.navigateToFrontend()
  })

  it("Should successfully create a screen", () => {
    cy.createScreen("Test Screen", "/test")
  })
})
