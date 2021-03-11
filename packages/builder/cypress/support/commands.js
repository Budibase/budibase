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
  cy.visit(`localhost:${Cypress.env("PORT")}/_builder`)
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
      cy.get("input[name=email]")
        .click()
        .type("test@test.com")
      cy.get("input[name=password]")
        .click()
        .type("test")
      cy.contains("Submit").click()
      cy.get("[data-cy=new-table]", {
        timeout: 20000,
      }).should("be.visible")
    })
})

Cypress.Commands.add("deleteApp", name => {
  cy.visit(`localhost:${Cypress.env("PORT")}/_builder`)
  cy.get("body").then($body => {
    cy.wait(1000)
    if ($body.find(`[data-cy="app-${name}"]`).length) {
      cy.get(`[data-cy="app-${name}"] a`).click()
      cy.get("[data-cy=settings-icon]").click()
      cy.get(".modal-content").within(() => {
        cy.contains("Danger Zone").click()
        cy.get("input").type("DELETE")
        cy.contains("Delete Entire App").click()
      })
    }
  })
})

Cypress.Commands.add("createTestApp", () => {
  const appName = "Cypress Tests"
  cy.deleteApp(appName)
  cy.createApp(appName, "This app is used for Cypress testing.")
})

Cypress.Commands.add("createTestTableWithData", () => {
  cy.createTable("dog")
  cy.addColumn("dog", "name", "Text")
  cy.addColumn("dog", "age", "Number")
})

Cypress.Commands.add("createTable", tableName => {
  // Enter table name
  cy.get("[data-cy=new-table]").click()
  cy.get(".modal").within(() => {
    cy.get("input")
      .first()
      .type(tableName)
    cy.get(".buttons")
      .contains("Create")
      .click()
  })
  cy.contains(tableName).should("be.visible")
})

Cypress.Commands.add("addColumn", (tableName, columnName, type) => {
  // Select Table
  cy.contains(".nav-item", tableName).click()
  cy.contains("Create New Column").click()

  // Configure column
  cy.get(".actions").within(() => {
    cy.get("input")
      .first()
      .type(columnName)

    // Unset table display column
    cy.contains("display column").click()
    cy.get("select").select(type)
    cy.contains("Save").click()
  })
})

Cypress.Commands.add("addRow", values => {
  cy.contains("Create New Row").click()
  cy.get(".modal").within(() => {
    for (let i = 0; i < values.length; i++) {
      cy.get("input")
        .eq(i)
        .type(values[i])
    }
    cy.get(".buttons")
      .contains("Create")
      .click()
  })
})

Cypress.Commands.add("createUser", (email, password, role) => {
  // Create User
  cy.contains("Users").click()
  cy.contains("Create New User").click()
  cy.get(".modal").within(() => {
    cy.get("input")
      .first()
      .type(email)
    cy.get("input")
      .eq(1)
      .type(password)
    cy.get("select")
      .first()
      .select(role)

    // Save
    cy.get(".buttons")
      .contains("Create User")
      .click()
  })
})

Cypress.Commands.add("addComponent", (category, component) => {
  if (category) {
    cy.get(`[data-cy="category-${category}"]`).click()
  }
  cy.get(`[data-cy="component-${component}"]`).click()
  cy.wait(500)
  cy.location().then(loc => {
    const params = loc.pathname.split("/")
    const componentId = params[params.length - 1]
    cy.getComponent(componentId).should("exist")
    return cy.wrap(componentId)
  })
})

Cypress.Commands.add("getComponent", componentId => {
  return cy
    .get("iframe")
    .its("0.contentDocument")
    .should("exist")
    .its("body")
    .should("not.be.null")
    .then(cy.wrap)
    .find(`[data-component-id=${componentId}]`)
})

Cypress.Commands.add("navigateToFrontend", () => {
  cy.contains("design").click()
})

Cypress.Commands.add("createScreen", (screenName, route) => {
  cy.get("[data-cy=new-screen]").click()
  cy.get(".modal").within(() => {
    cy.get("input")
      .eq(0)
      .type(screenName)
    if (route) {
      cy.get("input")
        .eq(1)
        .type(route)
    }
    cy.contains("Create Screen").click()
  })
  cy.get(".nav-items-container").within(() => {
    cy.contains(route).should("exist")
  })
})
