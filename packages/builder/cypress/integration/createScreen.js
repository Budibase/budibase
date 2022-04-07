import filterTests from "../support/filterTests"

filterTests(["smoke", "all"], () => {
  /*
    Blank screen
    URL
    Screen access
    Screen access confirmation.

    CRUD Tests
    list the sources
    check for exluded contents
      rest, user table etc
  */

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

    it("Should update create the screen with the selected", () => {
      cy.createScreen("Test Screen", "admin only", "Admin")
      cy.get(".nav-items-container").within(() => {
        cy.contains("/admin-only").should("exist")
      })
    })
  })
})
