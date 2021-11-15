context("Create a User and Assign Roles", () => {
  before(() => {
    cy.login()
  })

  it("should create a user", () => {
    cy.createUser("bbuser@test.com")
    cy.contains("bbuser").should("be.visible")
  })
  
  it("should confirm there is No Access for a New User", () => {
    // Click into the user
    cy.contains("bbuser").click()
    // Get No Access table - Confirm it has apps in it
    cy.get(".spectrum-Table").eq(1).should('not.contain', 'No rows found')
    // Get Configure Roles table - Confirm it has no apps
    cy.get(".spectrum-Table").eq(0).contains('No rows found')
  })
  
  it("should assign role types", () => {
    // 3 apps minimum required - to assign an app to each role type
    cy.request(`localhost:${Cypress.env("PORT")}/api/applications?status=all`)
    .its("body")
    .then(val => {
      if (val.length < 3) {
        for (let i = 1; i < 3; i++) {
          const uuid = () => Cypress._.random(0, 1e6)
          const name = uuid()
          cy.createApp(name)
        }
      }
    })
    // Navigate back to the user
    cy.visit(`localhost:${Cypress.env("PORT")}/builder`)
    cy.wait(1000)
    cy.get(".spectrum-SideNav").contains("Users").click()
    cy.get(".spectrum-Table").contains("bbuser").click()
    cy.wait(500)
    for (let i = 0; i < 3; i++) {
      cy.get(".spectrum-Table-body").eq(1).find('tr').eq(0).click()
      cy.get(".spectrum-Dialog-grid").contains("Choose an option").click().then(() => {
        cy.wait(500)
        if (i == 0) {
          cy.get(".spectrum-Popover").contains("Admin").click()
        }
        if (i == 1) {
          cy.get(".spectrum-Popover").contains("Power").click()
        }
        if (i == 2) {
          cy.get(".spectrum-Popover").contains("Basic").click()
        }
        cy.wait(500)
        cy.get(".spectrum-Button").contains("Update role").click({ force: true })
        })
      }
      // Confirm roles exist within Configure roles table
      cy.get(".spectrum-Table-body").eq(0).within((assginedRoles) => {
        expect(assginedRoles).to.contain("Admin")
        expect(assginedRoles).to.contain("Power")
        expect(assginedRoles).to.contain("Basic")
      })
    })
    
  it("should unassign role types", () => {
    // Set each app within Configure roles table to 'No Access'
    cy.get(".spectrum-Table-body").eq(0).find('tr').its('length').then((len) => {
      for (let i = 0; i < len; i ++){
        cy.get(".spectrum-Table-body").eq(0).find('tr').eq(0).click().then(() => {
          cy.get(".spectrum-Form-item").contains("Role").parent().within(() => {
            cy.get(".spectrum-Picker").click({ force: true })
            cy.wait(500)
            cy.get(".spectrum-Popover").contains("No Access").click()
          })
          cy.get(".spectrum-Button").contains("Update role").click({ force: true })
          cy.wait(1000)
        })
      }
    })
    // Confirm Configure roles table no longer has any apps in it
    cy.get(".spectrum-Table-body").eq(0).contains('No rows found')
  })
    
  it("should enable Developer access", () => {
    // Enable Developer access
    cy.get(".field").eq(4).within(() => {
      cy.get(".spectrum-Form-item").click()
    })
    // No Access table should now be empty
    cy.get(".container").contains("No Access").parent().within(() => {
      cy.get(".spectrum-Table").contains("No rows found")
    
    // Each app within Configure roles should have Admin access
    cy.get(".spectrum-Table-body").eq(0).find('tr').its('length').then((len) => {
      for (let i = 0; i < len; i++) {
        cy.get(".spectrum-Table-body").eq(0).find('tr').eq(i).contains("Admin")
        cy.wait(500)
      }
    })
  })
})
    
  it("should disable Developer access", () => {
    // Disable Developer access
    cy.get(".field").eq(4).within(() => {
      cy.get(".spectrum-Form-item").click()
    })
    // Configure roles table should now be empty
    cy.get(".container").contains("Configure roles").parent().within(() => {
      cy.get(".spectrum-Table").contains("No rows found")
    })
  })
  
  it("should delete a user", () => {
    // Click Delete user button
    cy.get(".spectrum-Button").contains("Delete user").click({force: true}).then(() => {
      // Confirm deletion within modal
      cy.wait(500)
      cy.get(".spectrum-Dialog-grid").within(() => {
        cy.get(".spectrum-Button").contains("Delete user").click({force: true})
        cy.wait(4000)
      })
    })
    cy.get(".spectrum-Table-body").should("not.have.text", "bbuser")
  })
})
