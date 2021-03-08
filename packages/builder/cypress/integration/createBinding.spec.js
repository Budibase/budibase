context("Create Bindings", () => {
  before(() => {
    cy.createTestApp()
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

  it("should handle an invalid binding", () => {
    cy.addComponent("Elements", "Paragraph").then(componentId => {
      // Cypress needs to escape curly brackets
      cy.get("[data-cy=setting-text] input")
        .type("{{}{{}{{} Current User._id {}}{}}")
        .blur()
      cy.getComponent(componentId).should("have.text", "{{{ user._id }}")
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

  it("should add a binding with a handlebars helper", () => {
    cy.addComponent("Elements", "Paragraph").then(componentId => {
      // Cypress needs to escape curly brackets
      addSettingBinding("text", "{{}{{} add 1 2 {}}{}}", false)
      cy.getComponent(componentId).should("have.text", "3")
    })
  })
})

const addSettingBinding = (setting, bindingText, clickOption = true) => {
  cy.get(`[data-cy="setting-${setting}"] [data-cy=text-binding-button]`).click()
  cy.get(".drawer").within(() => {
    if (clickOption) {
      cy.contains(bindingText).click()
      cy.get("textarea").should("have.value", `{{ ${bindingText} }}`)
    } else {
      cy.get("textarea").type(bindingText)
    }
    cy.get("button").click()
  })
}
