import filterTests from "../support/filterTests"

filterTests(["smoke", "all"], () => {
  context("Screen Tests", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
      cy.navigateToFrontend()
    })

    it("Should successfully create a screen", () => {
      cy.createScreen("Test Screen", "/test")
      cy.get(".nav-items-container").within(() => {
        cy.contains("/test").should("exist")
      })
    })

    it("Should update the url", () => {
      cy.createScreen("Test Screen", "test with spaces")
      cy.get(".nav-items-container").within(() => {
        cy.contains("/test-with-spaces").should("exist")
      })
    })
  })
})
