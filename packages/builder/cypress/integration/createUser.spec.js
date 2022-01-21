context("Create a User", () => {
  before(() => {
    cy.login()
  })

  it("should create a user", () => {
    cy.createUser("bbuser@test.com")
    cy.contains("bbuser").should("be.visible")
  })
})
