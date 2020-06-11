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

Cypress.Commands.add("createApp", (name, description) => {
    cy.get('.banner-button')
        .click()
        .get('input[name="name"]')
        .type(name).should('have.value', name)

    cy.get('textarea[name="description"]')
        .type(description).should('have.value', description)

    cy.contains('Save').click()
})
Cypress.Commands.add("createModel", (modelName, firstField, secondField) => {
    // Enter model name
    cy.get('.budibase__input')
        .type(modelName)

    // Add 'name' field
    cy.get('.new-field')
        .click()
    cy.get('.budibase__input').first()
        .type(firstField)
    cy.contains('Save').click()


    // Add 'age' field
    cy.get('.new-field')
        .click()
    cy.get('.budibase__input').first()
        .type(secondField)
    cy.get('select').select('number')
    cy.contains('Save').click()
    cy.contains(secondField).should('exist')

    // Save model
    cy.contains('Save').click()
})
Cypress.Commands.add("addRecord", (firstField, secondField) => {
    cy.contains('Create new record')
        .click()

    cy.get(':nth-child(1) > .uk-input').type(firstField).get(':nth-child(2) > .uk-input').type(secondField)

    // Save
    cy.contains('Save').click()
})

Cypress.Commands.add("createUser", (username, password, level) => {
    // Create User
    cy.get('.nav-group-header > .ri-add-line')
        .click()

    cy.get(':nth-child(2) > .uk-input').type(username)
    cy.get(':nth-child(3) > .uk-input').type(password)
    cy.get('.uk-select').select(level)

    // Save
    cy.contains('Save').click()
})