context("Create Bindings", () => {
  before(() => {
    cy.createApp("Cypress Tests", "Cypress test app")
    cy.navigateToFrontend()
  })

  it("should add a current user binding", () => {
    cy.addComponent("Elements", "Paragraph").then(componentId => {
      addSettingBinding("text", "Current User._id")
      cy.getComponent(componentId).should(
        "have.text",
        `ro_ta_users_us_test@test.com`
      )
    })
  })

  it("should add a URL param binding", () => {
    const paramName = "foo"
    cy.createScreen("Test Param", `/test/:${paramName}`)
    cy.addComponent("Elements", "Paragraph").then(componentId => {
      addSettingBinding("text", `URL.${paramName}`)
      // The builder preview pages don't have a real URL, so all we can do
      // is check that we were able to bind to the property, and that the
      // component exists on the page
      cy.getComponent(componentId).should("have.text", "")
    })
  })
})

const addSettingBinding = (setting, bindingText) => {
  cy.get(`[data-cy="setting-${setting}"] [data-cy=text-binding-button]`).click()
  cy.get(".drawer").within(() => {
    cy.contains(bindingText).click()
    cy.get("textarea").should("have.value", `{{ ${bindingText} }}`)
    cy.get("button").click()
  })
}
