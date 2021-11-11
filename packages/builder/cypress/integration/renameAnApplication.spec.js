context("Rename an App", () => {
    beforeEach(() => {
      cy.login()
      cy.createTestApp()
    })

it("should rename an unpublished application", () => {
    const appRename = "Cypress Renamed"
    // Rename app, Search for app, Confirm name was changed
    cy.get(".home-logo").click()
    renameApp(appRename)
    cy.searchForApplication(appRename)
    cy.get(".appGrid").find(".wrapper").should("have.length", 1)
    cy.deleteApp(appRename)
})
    
xit("Should rename a published application", () => {
    // It is not possible to rename a published application
    const appRename = "Cypress Renamed"
    // Publish the app
    cy.get(".toprightnav")
    cy.get(".spectrum-Button").contains("Publish").click({force: true})
    cy.get(".spectrum-Dialog-grid")
        .within(() => {
            // Click publish again within the modal
            cy.get(".spectrum-Button").contains("Publish").click({force: true})
        })
    // Rename app, Search for app, Confirm name was changed
    cy.get(".home-logo").click()
    renameApp(appRename, true)
    cy.searchForApplication(appRename)
    cy.get(".appGrid").find(".wrapper").should("have.length", 1)
})

it("Should try to rename an application to have no name", () => {
    cy.get(".home-logo").click()
    renameApp(" ", false, true)
    // Close modal and confirm name has not been changed
    cy.get(".spectrum-Dialog-grid").contains("Cancel").click()
    cy.searchForApplication("Cypress Tests")
    cy.get(".appGrid").find(".wrapper").should("have.length", 1)
})

xit("Should create two applications with the same name", () => {
    // It is not possible to have applications with the same name
    const appName = "Cypress Tests"
    cy.visit(`localhost:${Cypress.env("PORT")}/builder`)
    cy.wait(500)
    cy.get(".spectrum-Button").contains("Create app").click({force: true})
    cy.contains(/Start from scratch/).click()
    cy.get(".spectrum-Modal")
    .within(() => {
      cy.get("input").eq(0).type(appName)
      cy.get(".spectrum-ButtonGroup").contains("Create app").click({force: true})
      cy.get(".error").should("have.text", "Another app with the same name already exists")      
    })
})

it("should validate application names", () => {
    // App name must be letters, numbers and spaces only
    // This test checks numbers and special characters specifically
    const numberName = 12345
    const specialCharName = "£$%^"
    cy.get(".home-logo").click()
    renameApp(numberName)
    cy.searchForApplication(numberName)
    cy.get(".appGrid").find(".wrapper").should("have.length", 1)
    renameApp(specialCharName)
    cy.get(".error").should("have.text", "App name must be letters, numbers and spaces only")
})
    
    const renameApp = (appName, published, noName) => {
    cy.request(`localhost:${Cypress.env("PORT")}/api/applications?status=all`)
    .its("body")
    .then(val => {
        if (val.length > 0) {
            cy.get(".title > :nth-child(3) > .spectrum-Icon").click()
            // Check for when an app is published
            if (published == true){
                // Should not have Edit as option, will unpublish app
                cy.should("not.have.value", "Edit")
                cy.get(".spectrum-Menu").contains("Unpublish").click()
                cy.get(".spectrum-Dialog-grid").contains("Unpublish app").click()
                cy.get(".title > :nth-child(3) > .spectrum-Icon").click()
            }
            cy.contains("Edit").click()
            cy.get(".spectrum-Modal")
            .within(() => {
                if (noName == true){
                    cy.get("input").clear()
                    cy.get(".spectrum-Dialog-grid").click()
                    .contains("App name must be letters, numbers and spaces only")
                    return cy
                }
                cy.get("input").clear()
                cy.get("input").eq(0).type(appName).should("have.value", appName).blur()
                cy.get(".spectrum-ButtonGroup").contains("Save").click({force: true})
                cy.wait(500)
      })
    }
    })
}
})
