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
        cy.get("input[name=apiKey]").type(name).should("have.value", name)
        cy.contains("Next").click()
      }
    })
    .then(() => {
      cy.get("input[name=applicationName]")
        .type(name)
        .should("have.value", name)

      cy.contains("Next").click()

      cy.get("input[name=username]").click().type("test")
      cy.get("input[name=password]").click().type("test")
      cy.contains("Submit").click()
      cy.get("[data-cy=new-table]", {
        timeout: 20000,
      }).should("be.visible")
    })
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
    cy.get("input").first().type(tableName)
    cy.get(".buttons").contains("Create").click()
  })
  cy.contains(tableName).should("be.visible")
})

Cypress.Commands.add("addColumn", (tableName, columnName, type) => {
  // Select Table
  cy.contains(".nav-item", tableName).click()
  cy.contains("Create New Column").click()

  // Configure column
  cy.get(".menu-container").within(() => {
    cy.get("input").first().type(columnName)
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
      cy.get("input").eq(i).type(values[i])
    }

    // Save
    cy.get(".buttons").contains("Create").click()
  })
})

Cypress.Commands.add("createUser", (username, password, accessLevel) => {
  // Create User
  cy.get(".toprightnav > .settings").click()
  cy.contains("Users").click()

  cy.get("[name=Name]").first().type(username)
  cy.get("[name=Password]").first().type(password)
  cy.get("select").first().select(accessLevel)

  // Save
  cy.get(".inputs").contains("Create").click()
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
  cy.contains("design").click()
})

Cypress.Commands.add("createScreen", (screenName, route) => {
  cy.get("[data-cy=new-screen]").click()
  cy.get(".modal").within(() => {
    cy.get("input").eq(0).type(screenName)
    if (route) {
      cy.get("input").eq(1).type(route)
    }
    cy.contains("Create Screen").click()
  })
  cy.get(".nav-items-container").within(() => {
    cy.contains(screenName).should("exist")
  })
})
