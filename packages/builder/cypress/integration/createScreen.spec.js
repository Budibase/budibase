import filterTests from "../support/filterTests"
const interact = require('../support/interact')

filterTests(["smoke", "all"], () => {
  context("Screen Tests", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
      cy.navigateToFrontend()
    })

    it.skip("Should successfully create a screen", () => {
      cy.createScreen("test")
      cy.get(interact.BODY).within(() => {
        cy.contains("/test").should("exist")
      })
    })

    it("Should update the url", () => {
      cy.createScreen("test with spaces")
      cy.get(interact.BODY).within(() => {
        cy.contains("/test-with-spaces").should("exist")
      })
    })

    it.skip("should delete all screens then create first screen via button", () => {
      cy.deleteAllScreens()
      
      cy.contains("Create first screen").click()
      cy.get(interact.BODY, { timeout: 2000 }).should('contain', '/home')
    })

    it("Should create and filter screens by access level", () => {
      const accessLevels = ["Basic", "Admin", "Public", "Power"]

      for (const access of accessLevels){
        // Create screen with specified access level
        cy.createScreen(access, access)
        // Filter by access level and confirm screen visible
        cy.filterScreensAccessLevel(access)
        cy.get(interact.BODY).within(() => {
          cy.get(interact.NAV_ITEM).should('contain', access.toLowerCase())
        })
      }

      // Filter by All screens - Confirm all screens visible
      cy.filterScreensAccessLevel("All screens")
      cy.get(interact.BODY).should('contain', accessLevels[0])
      .and('contain', accessLevels[1])
      .and('contain', accessLevels[2])
      .and('contain', accessLevels[3])
    })
  })
})
