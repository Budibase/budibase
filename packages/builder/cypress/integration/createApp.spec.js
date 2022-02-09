import filterTests from '../support/filterTests'

filterTests(['smoke', 'all'], () => {
  xcontext("Create an Application", () => {
    it("should create a new application", () => {
      cy.login()
      cy.createTestApp()
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.contains("Cypress Tests").should("exist")
    })
  })  
})
