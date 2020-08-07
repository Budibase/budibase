// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("createApp", name => {
  cy.contains("Create New Web App").click()

  cy.get("body")
    .then($body => {
      if ($body.find("input[name=apiKey]").length) {
        // input was found, do something else here
        cy.get("input[name=apiKey]")
          .type(name)
          .should("have.value", name)
        cy.contains("Next").click()
      }
    })
    .then(() => {
      cy.get("input[name=applicationName]")
        .type(name)
        .should("have.value", name)

      cy.contains("Next").click()

      cy.get("input[name=username]")
        .click()
        .type("test")
      cy.get("input[name=password]")
        .click()
        .type("test")
      cy.contains("Submit").click()
      cy.contains("Create New Table", {
        timeout: 10000,
      }).should("be.visible")
    })
})

Cypress.Commands.add("createModel", modelName => {
  // Enter model name
  cy.contains("Create New Table").click()
  cy.get("[data-cy=table-name-input]").type(modelName)

  // Add 'name' field
  cy.contains("Add").click()
  cy.contains("Plain Text").click()

  // Add 'age' field
  cy.contains("Add").click()
  cy.contains("Number").click()

  cy.contains("Save").click()

  cy.contains(modelName).click()
})

Cypress.Commands.add("addRecord", (firstField, secondField) => {
  cy.contains("Create New Record").click()

  cy.get("[data-cy='Plain Text-input']").type(firstField)
  cy.get("[data-cy=Number-input]").type(secondField)

  // Save
  cy.contains("Save").click()
})

Cypress.Commands.add("createUser", (username, password) => {
  // Create User
  cy.get(".toprightnav > .settings").click()
  cy.contains("Users").click()

  cy.get("[name=Name]")
    .first()
    .type(username)
  cy.get("[name=Password]")
    .first()
    .type(password)

  // Save
  cy.get(".create-button").click()
})

Cypress.Commands.add("addHeadlineComponent", text => {
  cy.get(".switcher > :nth-child(2)").click()

  cy.get("[data-cy=Text]").click()
  cy.get("[data-cy=Headline]").click()
  cy.get(".tabs > :nth-child(2)").click()
  cy.contains("Settings").click()
  cy.get('input[name="text"]').type(text)
  cy.contains("Design").click()
})
Cypress.Commands.add("addButtonComponent", () => {
  cy.get(".switcher > :nth-child(2)").click()

  cy.get("[data-cy=Button]").click()
})

Cypress.Commands.add("navigateToFrontend", () => {
  cy.contains("frontend").click()
})

Cypress.Commands.add("createScreen", (screenName, route) => {
  cy.get(".newscreen").click()
  cy.get(".uk-input:first").type(screenName)
  if (route) {
    cy.get(".uk-input:last").type(route)
  }
  cy.get(".uk-modal-footer").within(() => {
    cy.contains("Create Screen").click()
  })
  cy.get(".nav-items-container").within(() => {
    cy.contains(screenName).should("exist")
  })
})
