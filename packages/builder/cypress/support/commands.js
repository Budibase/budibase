Cypress.on("uncaught:exception", () => {
  return false
})

// ACCOUNTS & USERS
Cypress.Commands.add("login", (email, password) => {
  cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 30000 })
  cy.url()
    .should("include", "/builder/")
    .then(url => {
      if (url.includes("builder/admin")) {
        // create admin user
        cy.get("input").first().type("test@test.com")
        cy.get('input[type="password"]').first().type("test")
        cy.get('input[type="password"]').eq(1).type("test")
        cy.contains("Create super admin user").click({ force: true })
      }
      if (url.includes("builder/auth") || url.includes("builder/admin")) {
        // login
        cy.contains("Sign in to Budibase").then(() => {
          if (email == null) {
            cy.get("input").first().type("test@test.com")
            cy.get('input[type="password"]').type("test")
          } else {
            cy.get("input").first().type(email)
            cy.get('input[type="password"]').type(password)
          }
          cy.get("button").first().click({ force: true })
          cy.wait(1000)
        })
      }
    })
})

Cypress.Commands.add("logOut", () => {
  cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 30000 })
  cy.get(".user-dropdown .avatar > .icon").click({ force: true })
  cy.get(".spectrum-Popover[data-cy='user-menu']").within(() => {
    cy.get("li[data-cy='user-logout']").click({ force: true })
  })
  cy.wait(2000)
})

Cypress.Commands.add("logoutNoAppGrid", () => {
  // Logs user out when app grid is not present
  cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 30000 })
  cy.get(".avatar > .icon").click({ force: true })
  cy.get(".spectrum-Popover[data-cy='user-menu']").within(() => {
    cy.get(".spectrum-Menu-item").contains("Log out").click({ force: true })
  })
  cy.wait(2000)
})

Cypress.Commands.add("createUser", (email, permission) => {
  cy.contains("Users").click()
  cy.get(`[data-cy="add-user"]`).click()
  cy.get(".spectrum-Dialog-grid").within(() => {
    // Enter email
    cy.get(".spectrum-Textfield-input").clear().click().type(email)

    // Select permission, if applicable
    // Default is App User
    if (permission != null) {
      cy.get(".spectrum-Picker-label").click()
      cy.get(".spectrum-Menu").within(() => {
        cy.get(".spectrum-Menu-item")
          .contains(permission)
          .click({ force: true })
      })
    }
    // Add user
    cy.get(".spectrum-Button").contains("Add users").click({ force: true })
    cy.get(".spectrum-ActionButton").contains("Add email").should("not.exist")
  })
  // Onboarding modal
  cy.get(".spectrum-Dialog-grid", { timeout: 5000 }).contains(
    "Choose your onboarding"
  )
  cy.get(".spectrum-Dialog-grid").within(() => {
    cy.get(".onboarding-type").eq(1).click()
    cy.get(".spectrum-Button").contains("Done").click({ force: true })
    cy.get(".spectrum-Button").contains("Cancel").should("not.exist")
  })

  // Accounts created modal - Click Done button
  cy.get(".spectrum-Button").contains("Done").click({ force: true })
})

Cypress.Commands.add("deleteUser", email => {
  // Assumes user has access to Users section
  cy.contains("Users", { timeout: 2000 }).click()
  cy.contains(email).click()

  cy.get(".title").within(() => {
    cy.get(".spectrum-Icon").click({ force: true })
  })
  cy.get(".spectrum-Menu").within(() => {
    cy.get(".spectrum-Menu-item").contains("Delete").click({ force: true })
  })
  cy.get(".spectrum-Dialog-grid").contains("Delete user").click({ force: true })
})

Cypress.Commands.add("updateUserInformation", (firstName, lastName) => {
  cy.get(".user-dropdown .avatar > .icon", { timeout: 2000 }).click({
    force: true,
  })

  cy.get(".spectrum-Popover[data-cy='user-menu']").within(() => {
    cy.get("li[data-cy='user-info']").click({ force: true })
  })

  cy.get(".spectrum-Modal.is-open").within(() => {
    cy.get("[data-cy='user-first-name']").clear()

    if (!firstName || firstName == "") {
      cy.get("[data-cy='user-first-name']").invoke("val").should("be.empty")
    } else {
      cy.get("[data-cy='user-first-name']")
        .type(firstName)
        .should("have.value", firstName)
        .blur()
    }

    cy.get("[data-cy='user-last-name']").clear()

    if (!lastName || lastName == "") {
      cy.get("[data-cy='user-last-name']").invoke("val").should("be.empty")
    } else {
      cy.get("[data-cy='user-last-name']")
        .type(lastName)
        .should("have.value", lastName)
        .blur()
    }
    cy.get(".confirm-wrap").within(() => {
      cy.get("button").contains("Update information").click({ force: true })
    })
    cy.get(".spectrum-Dialog-grid").should("not.exist")
  })
})

Cypress.Commands.add("setUserRole", (user, role) => {
  cy.contains("Users").click()
  cy.contains(user).click()

  // Set Role
  cy.wait(500)
  cy.get(".spectrum-Form-itemField")
    .eq(3)
    .within(() => {
      cy.get(".spectrum-Picker-label").click({ force: true })
    })
  cy.get(".spectrum-Menu").within(() => {
    cy.get(".spectrum-Menu-itemLabel").contains(role).click({ force: true })
  })
  cy.get(".spectrum-Form-itemField").eq(3).should("contain", role)
})

// APPLICATIONS
Cypress.Commands.add("createTestApp", () => {
  const appName = "Cypress Tests"
  cy.deleteApp(appName)
  cy.createApp(appName, "This app is used for Cypress testing.")
})

Cypress.Commands.add("createApp", (name, addDefaultTable) => {
  const shouldCreateDefaultTable =
    typeof addDefaultTable != "boolean" ? true : addDefaultTable

  cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 30000 })
  cy.url({ timeout: 30000 }).should("include", "/apps")
  cy.get(`[data-cy="create-app-btn"]`, { timeout: 5000 }).click({ force: true })

  // If apps already exist
  cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`, {
    timeout: 5000,
  })
    .its("body")
    .then(val => {
      if (val.length > 0) {
        cy.get(`[data-cy="create-app-btn"]`, { timeout: 5000 }).click({
          force: true,
        })
      }
    })

  cy.get(".spectrum-Modal").within(() => {
    cy.get("input").eq(0).should("have.focus")
    if (name && name != "") {
      cy.get("input").eq(0).clear()
      cy.get("input").eq(0).type(name).should("have.value", name).blur()
    }
    cy.get(".spectrum-ButtonGroup")
      .contains("Create app")
      .click({ force: true })
    cy.wait(2000)
  })
  if (shouldCreateDefaultTable) {
    cy.createTable("Cypress Tests", true)
  }
})

Cypress.Commands.add("deleteApp", name => {
  cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 30000 })
  cy.wait(2000)
  cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
    .its("body")
    .then(val => {
      const findAppName = val.some(val => val.name == name)
      if (findAppName) {
        if (val.length > 0) {
          const appId = val.reduce((acc, app) => {
            if (name === app.name) {
              acc = app.appId
            }
            return acc
          }, "")

          if (appId == "") {
            return
          }

          // Go to app overview
          const appIdParsed = appId.split("_").pop()
          const actionEleId = `[data-cy=row_actions_${appIdParsed}]`
          cy.get(actionEleId).within(() => {
            cy.contains("Manage").click({ force: true })
          })
          cy.wait(500)

          // Unpublish first if needed
          cy.get(`[data-cy="app-status"]`).then($status => {
            if ($status.text().includes("- Unpublish")) {
              // Exact match for Unpublish
              cy.contains("Unpublish").click({ force: true })
              cy.get(".spectrum-Modal").within(() => {
                cy.contains("Unpublish app").click({ force: true })
              })
            }
          })

          // Delete app
          cy.get(".app-overview-actions-icon").within(() => {
            cy.get(".spectrum-Icon").click({ force: true })
          })
          cy.get(".spectrum-Menu").contains("Delete").click({ force: true })
          cy.get(".spectrum-Dialog-grid").within(() => {
            cy.get("input").type(name)
          })
          cy.get(".spectrum-Button--warning").click()
        } else {
          return
        }
      } else {
        return
      }
    })
})

Cypress.Commands.add("deleteAllApps", () => {
  cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 30000 })
  cy.wait(500)
  cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`, {
    timeout: 5000,
  })
    .its("body")
    .then(val => {
      for (let i = 0; i < val.length; i++) {
        cy.deleteApp(val[i].name)
        cy.reload()
      }
    })
})

Cypress.Commands.add("unlockApp", unlock_config => {
  let config = { ...unlock_config }

  cy.get(".spectrum-Modal .spectrum-Dialog[data-cy='app-lock-modal']")
    .should("be.visible")
    .within(() => {
      if (config.owned) {
        cy.get(".spectrum-Dialog-heading").contains("Locked by you")
        cy.get(".lock-expiry-body").contains(
          "This lock will expire in 10 minutes from now"
        )

        cy.intercept("**/lock").as("unlockApp")
        cy.get(".spectrum-Button")
          .contains("Release Lock")
          .click({ force: true })
        cy.wait("@unlockApp")
        cy.get("@unlockApp").its("response.statusCode").should("eq", 200)
        cy.get("@unlockApp").its("response.body").should("deep.equal", {
          message: "Lock released successfully.",
        })
      } else {
        //Show the name ?
        cy.get(".lock-expiry-body").should("not.be.visible")
        cy.get(".spectrum-Button").contains("Done")
      }
    })
})

Cypress.Commands.add("updateAppName", (changedName, noName) => {
  cy.get(".spectrum-Modal").within(() => {
    if (noName == true) {
      cy.get("input").clear()
      cy.get(".spectrum-Dialog-grid")
        .click()
        .contains("App name must be letters, numbers and spaces only")
      return cy
    }
    cy.get("input").clear()
    cy.get("input")
      .eq(0)
      .type(changedName)
      .should("have.value", changedName)
      .blur()
    cy.get(".spectrum-ButtonGroup").contains("Save").click({ force: true })
    cy.wait(500)
  })
})

Cypress.Commands.add("publishApp", resolvedAppPath => {
  // Assumes you have navigated to an application first
  cy.get(".toprightnav button.spectrum-Button")
    .contains("Publish")
    .click({ force: true })

  cy.get(".spectrum-Modal [data-cy='deploy-app-modal']")
    .should("be.visible")
    .within(() => {
      cy.get(".spectrum-Button").contains("Publish").click({ force: true })
      cy.wait(1000)
    })

  // Verify that the app url is presented correctly to the user
  cy.get(".spectrum-Modal [data-cy='deploy-app-success-modal']")
    .should("be.visible")
    .within(() => {
      let appUrl = Cypress.config().baseUrl + "/app/" + resolvedAppPath
      cy.get("[data-cy='deployed-app-url'] input").should("have.value", appUrl)
      cy.get(".spectrum-Button").contains("Done").click({ force: true })
    })
})

Cypress.Commands.add("alterAppVersion", (appId, version) => {
  return cy
    .request("put", `${Cypress.config().baseUrl}/api/applications/${appId}`, {
      version: version || "0.0.1-alpha.0",
    })
    .then(resp => {
      expect(resp.status).to.eq(200)
    })
})

Cypress.Commands.add("importApp", (exportFilePath, name) => {
  cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 30000 })

  cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
    .its("body")
    .then(val => {
      if (val.length > 0) {
        cy.get(`[data-cy="create-app-btn"]`).click({ force: true })
      }
      cy.wait(500)
      cy.get(`[data-cy="import-app-btn"]`).click({
        force: true,
      })
    })

  cy.get(".spectrum-Modal").within(() => {
    cy.get("input").eq(1).should("have.focus")

    cy.get(".spectrum-Dropzone").selectFile(exportFilePath, {
      action: "drag-drop",
    })

    cy.get(".gallery .filename").contains("exported-app.txt")

    if (name && name != "") {
      cy.get("input").eq(0).type(name).should("have.value", name).blur()
    }
    cy.get(".confirm-wrap button")
      .should("not.be.disabled")
      .click({ force: true })
    cy.wait(3000)
  })
})

// Filters visible with 1 or more
Cypress.Commands.add("searchForApplication", appName => {
  cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 30000 })
  cy.wait(2000)

  // No app filter functionality if only 1 app exists
  cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
    .its("body")
    .then(val => {
      if (val.length < 2) {
        return
      } else {
        // Searches for the app
        cy.get(".filter").then(() => {
          cy.get(".spectrum-Textfield").within(() => {
            cy.get("input").eq(0).clear({ force: true })
            cy.get("input").eq(0).type(appName, { force: true })
          })
        })
      }
    })
})

// Assumes there are no others
Cypress.Commands.add("applicationInAppTable", appName => {
  cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 30000 })
  cy.get(".appTable", { timeout: 5000 }).within(() => {
    cy.get(".title").contains(appName).should("exist")
  })
})

Cypress.Commands.add("createAppFromScratch", appName => {
  cy.get(`[data-cy="create-app-btn"]`)
    .contains("Start from scratch")
    .click({ force: true })
  cy.get(".spectrum-Modal").within(() => {
    cy.get("input")
      .eq(0)
      .clear()
      .type(appName)
      .should("have.value", appName)
      .blur()
    cy.get(".spectrum-ButtonGroup").contains("Create app").click()
    cy.wait(10000)
  })
  cy.createTable("Cypress Tests", true)
})

// TABLES
Cypress.Commands.add("createTable", (tableName, initialTable) => {
  // Creates an internal Budibase DB table
  if (!initialTable) {
    cy.navigateToDataSection()
  }
  cy.get(`[data-cy="new-datasource"]`, { timeout: 2000 }).click()
  cy.wait(2000)
  cy.get(".item", { timeout: 2000 })
    .contains("Budibase DB")
    .click({ force: true })
    .then(() => {
      cy.get(".spectrum-Button", { timeout: 2000 })
        .contains("Continue")
        .click({ force: true })
    })
  cy.get(".spectrum-Modal").contains("Create Table", { timeout: 10000 })
  cy.get(".spectrum-Modal", { timeout: 2000 }).within(() => {
    cy.get("input", { timeout: 2000 }).first().type(tableName).blur()
    cy.get(".spectrum-ButtonGroup").contains("Create").click()
  })
  // Ensure modal has closed and table is created
  cy.get(".spectrum-Modal", { timeout: 2000 }).should("not.exist")
  cy.get(".nav-item", { timeout: 2000 })
    .contains("Budibase DB")
    .click({ force: true })
  cy.get(".spectrum-Tabs-content", { timeout: 2000 }).should(
    "contain",
    tableName
  )
})

Cypress.Commands.add("createTestTableWithData", () => {
  cy.createTable("dog")
  cy.addColumn("dog", "name", "Text")
  cy.addColumn("dog", "age", "Number")
})

Cypress.Commands.add(
  "addColumn",
  (tableName, columnName, type, multiOptions = null) => {
    // Select Table
    cy.selectTable(tableName)
    cy.contains(".nav-item", tableName).click()
    cy.contains("Create column").click()

    // Configure column
    cy.get(".spectrum-Modal").within(() => {
      cy.get("input").first().type(columnName).blur()

      // Unset table display column
      cy.contains("display column").click({ force: true })
      cy.get(".spectrum-Picker-label").click()
      cy.contains(type).click()

      // Add options for Multi-select Type
      if (multiOptions !== null) {
        cy.get(".spectrum-Textfield-input").eq(1).type(multiOptions)
      }

      cy.contains("Save Column").click()
    })
  }
)

Cypress.Commands.add("addRow", values => {
  cy.contains("Create row").click()
  cy.get(".spectrum-Modal").within(() => {
    for (let i = 0; i < values.length; i++) {
      cy.get("input").eq(i).type(values[i]).blur()
    }
    cy.get(".spectrum-ButtonGroup").contains("Create").click()
  })
})

Cypress.Commands.add("addRowMultiValue", values => {
  cy.contains("Create row").click()
  cy.get(".spectrum-Modal").within(() => {
    cy.get(".spectrum-Form-itemField")
      .click()
      .then(() => {
        cy.get(".spectrum-Popover").within(() => {
          for (let i = 0; i < values.length; i++) {
            cy.get(".spectrum-Menu-item").eq(i).click()
          }
        })
        cy.get(".spectrum-Dialog-grid").click("top")
        cy.get(".spectrum-ButtonGroup").contains("Create").click()
      })
  })
})

Cypress.Commands.add("selectTable", tableName => {
  cy.get(".nav-item").contains("Budibase DB").click()
  cy.contains(".nav-item", tableName).click()
})

Cypress.Commands.add("addCustomSourceOptions", totalOptions => {
  cy.get('[data-cy="customOptions-prop-control"]').within(() => {
    cy.get(".spectrum-ActionButton-label").click({ force: true })
  })
  for (let i = 0; i < totalOptions; i++) {
    // Add radio button options
    cy.get(".spectrum-Button-label", { timeout: 1000 })
      .contains("Add Option")
      .click({ force: true })
      .then(() => {
        cy.get("[placeholder='Label']", { timeout: 500 }).eq(i).type(i)
        cy.get("[placeholder='Value']").eq(i).type(i)
      })
  }
  // Save options
  cy.get(".spectrum-Button").contains("Save").click({ force: true })
})

// DESIGN SECTION
Cypress.Commands.add("searchAndAddComponent", component => {
  // Open component menu
  cy.get(".icon-side-nav").within(() => {
    cy.get(".icon-side-nav-item").eq(1).click()
  })
  cy.get(".add-component > .spectrum-Button")
    .contains("Add component")
    .click({ force: true })
  cy.get(".container", { timeout: 1000 }).within(() => {
    cy.get(".title").should("contain", "Add component")

    // Search and add component
    cy.get(".spectrum-Textfield-input").clear().type(component)
    cy.get(".body").within(() => {
      cy.get(".component")
        .contains(new RegExp("^" + component + "$"), { timeout: 3000 })
        .click({ force: true })
    })
  })
  cy.wait(1000)
  cy.location().then(loc => {
    const params = loc.pathname.split("/")
    const componentId = params[params.length - 1]
    cy.getComponent(componentId, { timeout: 3000 }).should("exist")
    return cy.wrap(componentId)
  })
})

Cypress.Commands.add("deleteComponentByName", componentName => {
  cy.get(".body")
    .eq(0)
    .contains(componentName)
    .siblings(".actions")
    .within(() => {
      cy.get(".spectrum-Icon").click({ force: true })
    })
  cy.get(".spectrum-Menu").contains("Delete").click()
  cy.get(".spectrum-Dialog").contains("Delete Component").click()
})

Cypress.Commands.add("addComponent", (category, component) => {
  if (category) {
    cy.get(`[data-cy="category-${category}"]`, { timeout: 3000 }).click({
      force: true,
    })
  }
  cy.wait(500)
  if (component) {
    cy.get(`[data-cy="component-${component}"]`, { timeout: 3000 }).click({
      force: true,
    })
  }
  cy.wait(1000)
  cy.location().then(loc => {
    const params = loc.pathname.split("/")
    const componentId = params[params.length - 1]
    cy.getComponent(componentId, { timeout: 3000 }).should("exist")
    return cy.wrap(componentId)
  })
})

Cypress.Commands.add("getComponent", componentId => {
  return cy
    .get("iframe")
    .its("0.contentDocument")
    .should("exist")
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap)
    .find(`[data-id='${componentId}']`)
})

Cypress.Commands.add("createScreen", (route, accessLevelLabel) => {
  // Blank Screen
  cy.contains("Design").click()
  cy.get(".spectrum-Button").contains("Add screen").click({ force: true })
  cy.get(".spectrum-Modal").within(() => {
    cy.get("[data-cy='blank-screen']").click()
    cy.get(".spectrum-Button").contains("Continue").click({ force: true })
  })
  cy.wait(500)
  cy.get(".spectrum-Dialog-grid", { timeout: 500 }).within(() => {
    cy.get(".spectrum-Form-itemField").eq(0).type(route)
    cy.get(".confirm-wrap").contains("Continue").click({ force: true })
  })

  cy.get(".spectrum-Modal", { timeout: 1000 }).within(() => {
    if (accessLevelLabel) {
      cy.get(".spectrum-Picker-label").click()
      cy.wait(500)
      cy.contains(accessLevelLabel).click()
    }
    cy.get(".spectrum-Button").contains("Done").click({ force: true })
  })
})

Cypress.Commands.add(
  "createDatasourceScreen",
  (datasourceNames, accessLevelLabel) => {
    cy.contains("Design").click()
    cy.get(".spectrum-Button").contains("Add screen").click({ force: true })
    cy.get(".spectrum-Dialog-grid").within(() => {
      cy.get("[data-cy='autogenerated-screens']").click()
      cy.intercept("**/api/datasources").as("autoScreens")
      cy.get(".spectrum-Button").contains("Continue").click({ force: true })
      cy.wait("@autoScreens")
      cy.wait(5000)
    })
    cy.get("[data-cy='autogenerated-screens']").should("not.exist")
    cy.get("[data-cy='data-source-modal']", { timeout: 10000 }).within(() => {
      for (let i = 0; i < datasourceNames.length; i++) {
        cy.get(".data-source-entry")
          .contains(datasourceNames[i], { timeout: 20000 })
          .click({ force: true })
        // Ensure the check mark is visible
        cy.get(".data-source-entry")
          .contains(datasourceNames[i])
          .get(".data-source-check", { timeout: 20000 })
          .should("exist")
      }

      cy.get(".spectrum-Button").contains("Confirm").click({ force: true })
    })

    cy.get(".spectrum-Modal", { timeout: 10000 }).within(() => {
      if (accessLevelLabel) {
        cy.get(".spectrum-Picker-label", { timeout: 10000 }).click()
        cy.contains(accessLevelLabel).click()
      }
      cy.get(".spectrum-Button").contains("Done").click({ force: true })
    })

    cy.contains("Design").click()
  }
)

Cypress.Commands.add(
  "createAutogeneratedScreens",
  (screenNames, accessLevelLabel) => {
    cy.navigateToAutogeneratedModal()

    for (let i = 0; i < screenNames.length; i++) {
      cy.get(".data-source-entry").contains(screenNames[i]).click()
    }

    cy.get(".spectrum-Modal").within(() => {
      if (accessLevelLabel) {
        cy.get(".spectrum-Picker-label").click()
        cy.wait(500)
        cy.contains(accessLevelLabel).click()
      }
      cy.get(".spectrum-Button").contains("Confirm").click({ force: true })
      cy.wait(4000)
    })
  }
)

Cypress.Commands.add("filterScreensAccessLevel", accessLevel => {
  // Filters screens by access level dropdown
  cy.get(".body").within(() => {
    cy.get(".spectrum-Form-item").eq(1).click()
  })
  cy.get(".spectrum-Menu").within(() => {
    cy.contains(accessLevel).click()
  })
})

Cypress.Commands.add("deleteScreen", screen => {
  // Navigates to Design section and deletes specified screen
  cy.contains("Design").click()
  cy.get(".body").within(() => {
    cy.contains(screen)
      .siblings(".actions")
      .within(() => {
        cy.get(".spectrum-Icon").click({ force: true })
      })
  })
  cy.get(".spectrum-Menu > .spectrum-Menu-item > .spectrum-Menu-itemLabel")
    .contains("Delete")
    .click()

  cy.get(
    ".spectrum-Dialog-grid > .spectrum-ButtonGroup > .confirm-wrap > .spectrum-Button"
  ).click({ force: true })
  cy.get(".spectrum-Dialog-grid", { timeout: 10000 }).should("not.exist")
})

Cypress.Commands.add("deleteAllScreens", () => {
  // Deletes all screens
  cy.get(".body")
    .find(".nav-item")
    .its("length")
    .then(len => {
      for (let i = 0; i < len; i++) {
        cy.get(".body > .nav-item")
          .eq(0)
          .invoke("text")
          .then(text => {
            cy.deleteScreen(text.trim())
          })
      }
    })
})

// NAVIGATION
Cypress.Commands.add("navigateToFrontend", () => {
  // Clicks on Design tab and then the Home nav item
  cy.wait(500)
  cy.intercept("**/preview").as("preview")
  cy.contains("Design").click()
  cy.wait("@preview")
  cy.get("@preview").then(res => {
    if (res.statusCode != 200) {
      cy.reload()
    }
  })
  cy.get(".spectrum-Search", { timeout: 20000 }).type("/")
  cy.get(".nav-item", { timeout: 2000 }).contains("home").click({ force: true })
})

Cypress.Commands.add("navigateToDataSection", () => {
  // Clicks on the Data tab
  cy.wait(500)
  cy.contains("Data").click()
})

Cypress.Commands.add("navigateToAutogeneratedModal", () => {
  // Screen name must already exist within datasource
  cy.contains("Design").click()
  cy.get(".spectrum-Button").contains("Add screen").click({ force: true })
  cy.get(".spectrum-Modal").within(() => {
    cy.get(".item", { timeout: 2000 })
      .contains("Autogenerated screens")
      .click({ force: true })
    cy.get(".spectrum-Button").contains("Continue").click({ force: true })
    cy.wait(500)
  })
})

// DATASOURCES
Cypress.Commands.add("selectExternalDatasource", datasourceName => {
  // Navigates to Data Section
  cy.navigateToDataSection()
  // Open Datasource modal
  cy.get(".nav").within(() => {
    cy.get("[data-cy='new-datasource']").click()
  })
  // Clicks specified datasource & continue
  cy.get(".item-list", { timeout: 1000 }).contains(datasourceName).click()
  cy.get(".spectrum-Dialog-grid").within(() => {
    cy.get(".spectrum-Button").contains("Continue").click({ force: true })
  })
  cy.wait(500)
})

Cypress.Commands.add("addDatasourceConfig", (datasource, skipFetch) => {
  // selectExternalDatasource should be called prior to this
  // Adds the config for specified datasource & fetches tables
  // Currently supports MySQL, PostgreSQL, Oracle
  // Host IP Address
  cy.get(".spectrum-Dialog-grid", { timeout: 500 }).within(() => {
    cy.get(".form-row")
      .eq(0)
      .within(() => {
        cy.get(".spectrum-Textfield").within(() => {
          if (datasource == "Oracle") {
            cy.get("input").clear().type(Cypress.env("oracle").HOST)
          } else {
            cy.get("input")
              .clear({ force: true })
              .type(Cypress.env("HOST_IP"), { force: true })
          }
        })
      })
  })
  // Database Name
  cy.get(".spectrum-Dialog-grid").within(() => {
    if (datasource == "MySQL") {
      cy.get(".form-row")
        .eq(4)
        .within(() => {
          cy.get("input").clear().type(Cypress.env("mysql").DATABASE)
        })
    } else {
      cy.get(".form-row")
        .eq(2)
        .within(() => {
          if (datasource == "PostgreSQL") {
            cy.get("input").clear().type(Cypress.env("postgresql").DATABASE)
          }
          if (datasource == "Oracle") {
            cy.get("input").clear().type(Cypress.env("oracle").DATABASE)
          }
        })
    }
  })
  // User
  cy.get(".spectrum-Dialog-grid").within(() => {
    if (datasource == "MySQL") {
      cy.get(".form-row")
        .eq(2)
        .within(() => {
          cy.get("input").clear().type(Cypress.env("mysql").USER)
        })
    } else {
      cy.get(".form-row")
        .eq(3)
        .within(() => {
          if (datasource == "PostgreSQL") {
            cy.get("input").clear().type(Cypress.env("postgresql").USER)
          }
          if (datasource == "Oracle") {
            cy.get("input").clear().type(Cypress.env("oracle").USER)
          }
        })
    }
  })
  // Password
  cy.get(".spectrum-Dialog-grid").within(() => {
    if (datasource == "MySQL") {
      cy.get(".form-row")
        .eq(3)
        .within(() => {
          cy.get("input").clear().type(Cypress.env("mysql").PASSWORD)
        })
    } else {
      cy.get(".form-row")
        .eq(4)
        .within(() => {
          if (datasource == "PostgreSQL") {
            cy.get("input").clear().type(Cypress.env("postgresql").PASSWORD)
          }
          if (datasource == "Oracle") {
            cy.get("input").clear().type(Cypress.env("oracle").PASSWORD)
          }
        })
    }
  })
  // Click to fetch tables
  if (skipFetch) {
    cy.get(".spectrum-Dialog-grid").within(() => {
      cy.get(".spectrum-Button")
        .contains("Skip table fetch")
        .click({ force: true })
    })
  } else {
    cy.intercept("**/tables").as("datasourceTables")
    cy.get(".spectrum-Dialog-grid").within(() => {
      cy.get(".spectrum-Button")
        .contains("Save and fetch tables")
        .click({ force: true })
    })
    // Wait for tables to be fetched
    cy.wait("@datasourceTables", { timeout: 60000 })
  }
})

Cypress.Commands.add("createRestQuery", (method, restUrl, queryPrettyName) => {
  // addExternalDatasource should be called prior to this
  // Configures REST datasource & sends query
  cy.get(".spectrum-Button", { timeout: 1000 })
    .contains("Add query")
    .click({ force: true })
  // Select Method & add Rest URL
  cy.get(".spectrum-Picker-label").eq(1).click()
  cy.get(".spectrum-Menu").contains(method).click()
  cy.get("input").clear().type(restUrl)
  // Send query
  cy.get(".spectrum-Button").contains("Send").click({ force: true })
  cy.get(".spectrum-Button", { timeout: 500 })
    .contains("Save")
    .click({ force: true })
  cy.get(".hierarchy-items-container")
    .should("contain", method)
    .and("contain", queryPrettyName)
})

// MISC
Cypress.Commands.add("closeModal", () => {
  cy.get(".spectrum-Modal", { timeout: 2000 }).within(() => {
    cy.get(".close-icon").click()
  })
  // Confirm modal has closed
  cy.get(".spectrum-Modal", { timeout: 10000 }).should("not.exist")
})

Cypress.Commands.add("expandBudibaseConnection", () => {
  if (Cypress.$(".nav-item > .content > .opened").length === 0) {
    // expand the Budibase DB connection string
    cy.get(".icon.arrow").eq(0).click()
  }
})
