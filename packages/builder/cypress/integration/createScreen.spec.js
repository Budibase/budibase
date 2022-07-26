import filterTests from "../support/filterTests"

filterTests(["smoke", "all"], () => {
  context("Screen Tests", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
      cy.navigateToFrontend()
    })

    it("Should successfully create a screen", () => {
      cy.createScreen("test")
      cy.get(".nav-items-container").within(() => {
        cy.contains("/test").should("exist")
      })
    })

    it("Should update the url", () => {
      cy.createScreen("test with spaces")
      cy.get(".nav-items-container").within(() => {
        cy.contains("/test-with-spaces").should("exist")
      })
    })

    it("Should create a blank screen with the selected access level", () => {
      cy.createScreen("admin only", "Admin")

      cy.get(".nav-items-container").within(() => {
        cy.contains("/admin-only").should("exist")
      })

      cy.createScreen("open to all", "Public")

      cy.get(".nav-items-container").within(() => {
        cy.contains("/open-to-all").should("exist")
        //The access level should now be set to admin. Previous screens should be filtered.
        cy.get(".nav-item").contains("/test-screen").should("not.exist")
      })
    })
  })
})
