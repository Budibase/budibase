context("Create Components", () => {
  let headlineId

  before(() => {
    cy.createTestApp()
    cy.createTable("dog")
    cy.addColumn("dog", "name", "string")
    cy.addColumn("dog", "age", "number")
    cy.addColumn("dog", "type", "options")
    cy.navigateToFrontend()
  })

  it("should add a container", () => {
    cy.addComponent(null, "Container").then(componentId => {
      cy.getComponent(componentId).should("exist")
    })
  })

  it("should add a headline", () => {
    cy.addComponent("Elements", "Headline").then(componentId => {
      headlineId = componentId
      cy.getComponent(headlineId).should("exist")
    })
  })

  it("should change the text of the headline", () => {
    const text = "Lorem ipsum dolor sit amet."
    cy.get("[data-cy=Settings]").click()
    cy.get("[data-cy=setting-text] input")
      .type(text)
      .blur()
    cy.getComponent(headlineId).should("have.text", text)
  })

  it("should change the size of the headline", () => {
    cy.get("[data-cy=Design]").click()
    cy.contains("Typography").click()
    cy.get("[data-cy=font-size-prop-control]").click()
    cy.contains("60px").click()
    cy.getComponent(headlineId).should("have.css", "font-size", "60px")
  })

  it("should create a form and reset to match schema", () => {
    cy.addComponent("Form", "Form").then(() => {
      cy.get("[data-cy=Settings]").click()
      cy.get("[data-cy=setting-datasource]")
        .contains("Choose option")
        .click()
      cy.get(".dropdown")
        .contains("dog")
        .click()
      cy.addComponent("Form", "Field Group").then(fieldGroupId => {
        cy.get("[data-cy=Settings]").click()
        cy.contains("Update Form Fields").click()
        cy.get(".modal")
          .get("button.primary")
          .click()
        cy.getComponent(fieldGroupId).within(() => {
          cy.contains("name").should("exist")
          cy.contains("age").should("exist")
          cy.contains("type").should("exist")
        })
        cy.getComponent(fieldGroupId)
          .find("input")
          .should("have.length", 2)
        cy.getComponent(fieldGroupId)
          .find(".spectrum-Picker")
          .should("have.length", 1)
      })
    })
  })
})
