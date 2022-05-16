// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

Cypress.on("uncaught:exception", () => {
  return false
})

Cypress.Commands.add("login", () => {
  cy.visit(`${Cypress.config().baseUrl}/builder`)
  cy.wait(2000)
  cy.url().then(url => {
    if (url.includes("builder/admin")) {
      // create admin user
      cy.get("input").first().type("test@test.com")
      cy.get('input[type="password"]').first().type("test")
      cy.get('input[type="password"]').eq(1).type("test")
      cy.contains("Create super admin user").click({ force: true })
    }
    if (url.includes("builder/auth/login") || url.includes("builder/admin")) {
      // login
      cy.contains("Sign in to Budibase").then(() => {
        cy.get("input").first().type("test@test.com")
        cy.get('input[type="password"]').type("test")
        cy.get("button").first().click({ force: true })
        cy.wait(1000)
      })
    }
  })
})

Cypress.Commands.add("closeModal", () => {
  cy.get(".spectrum-Modal").within(() => {
    cy.get(".close-icon").click()
    cy.wait(500)
  })
})

Cypress.Commands.add("createApp", (name, addDefaultTable) => {
  const shouldCreateDefaultTable =
    typeof addDefaultTable != "boolean" ? true : addDefaultTable

  cy.visit(`${Cypress.config().baseUrl}/builder`)
  cy.wait(1000)
  cy.get(`[data-cy="create-app-btn"]`).click({ force: true })

  // If apps already exist
  cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
    .its("body")
    .then(val => {
      if (val.length > 0) {
        cy.get(`[data-cy="create-app-btn"]`).click({ force: true })
      }
    })

  cy.get(".spectrum-Modal").within(() => {
    cy.get("input").eq(0).type(name).should("have.value", name).blur()
    cy.get(".spectrum-ButtonGroup")
      .contains("Create app")
      .click({ force: true })
    cy.wait(10000)
  })
  if (shouldCreateDefaultTable) {
    cy.createTable("Cypress Tests", true)
  }
})

Cypress.Commands.add("deleteApp", name => {
  cy.visit(`${Cypress.config().baseUrl}/builder`)
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

          const appIdParsed = appId.split("_").pop()
          const actionEleId = `[data-cy=row_actions_${appIdParsed}]`
          cy.get(actionEleId).within(() => {
            cy.get(".spectrum-Icon").eq(0).click({ force: true })
          })
          cy.get(".spectrum-Menu").then($menu => {
            if ($menu.text().includes("Unpublish")) {
              cy.get(".spectrum-Menu").contains("Unpublish").click()
              cy.get(".spectrum-Dialog-grid").contains("Unpublish app").click()
            }
          })

          cy.get(actionEleId).within(() => {
            cy.get(".spectrum-Icon").eq(0).click({ force: true })
          })
          cy.get(".spectrum-Menu").contains("Delete").click()
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
  cy.visit(`${Cypress.config().baseUrl}/builder`)
  cy.wait(500)
  cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
    .its("body")
    .then(val => {
      for (let i = 0; i < val.length; i++) {
        const appIdParsed = val[i].appId.split("_").pop()
        const actionEleId = `[data-cy=row_actions_${appIdParsed}]`
        cy.get(actionEleId).within(() => {
          cy.get(".spectrum-Icon").eq(0).click({ force: true })
        })

        cy.get(".spectrum-Menu").contains("Delete").click()
        cy.get(".spectrum-Dialog-grid").within(() => {
          cy.get("input").type(val[i].name)
          cy.get(".spectrum-Button--warning").click()
        })
        cy.reload()
      }
    })
})

Cypress.Commands.add("createTestApp", () => {
  const appName = "Cypress Tests"
  cy.deleteApp(appName)
  cy.createApp(appName, "This app is used for Cypress testing.")
  //cy.createScreen("home")
})

Cypress.Commands.add("createTestTableWithData", () => {
  cy.createTable("dog")
  cy.addColumn("dog", "name", "Text")
  cy.addColumn("dog", "age", "Number")
})

Cypress.Commands.add("createTable", (tableName, initialTable) => {
  if (!initialTable) {
    cy.navigateToDataSection()
    cy.get(`[data-cy="new-table"]`).click()
  }
  cy.wait(5000)
  cy.get(".spectrum-Dialog-grid")
    .contains("Budibase DB")
    .click({ force: true })
    .then(() => {
      cy.get(".spectrum-Button").contains("Continue").click({ force: true })
    })
  cy.get(".spectrum-Modal").within(() => {
    cy.wait(1000)
    cy.get("input").first().type(tableName).blur()
    cy.get(".spectrum-ButtonGroup").contains("Create").click()
  })
  cy.contains(tableName).should("be.visible")
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

Cypress.Commands.add("createUser", email => {
  // quick hacky recorded way to create a user
  cy.contains("Users").click()
  cy.get(`[data-cy="add-user"]`).click()
  cy.get(".spectrum-Picker-label").click()
  cy.get(".spectrum-Menu-item:nth-child(2) > .spectrum-Menu-itemLabel").click()

  //Onboarding type selector
  cy.get(
    ":nth-child(2) > .spectrum-Form-itemField > .spectrum-Textfield > .spectrum-Textfield-input"
  )
    .first()
    .type(email, { force: true })
  cy.get(".spectrum-Button--cta").click({ force: true })
})

Cypress.Commands.add("addComponent", (category, component) => {
  if (category) {
    cy.get(`[data-cy="category-${category}"]`).click({ force: true })
  }
  if (component) {
    cy.get(`[data-cy="component-${component}"]`).click({ force: true })
  }
  cy.wait(2000)
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
    .find(`[data-id=${componentId}]`)
})

Cypress.Commands.add("navigateToFrontend", () => {
  // Clicks on Design tab and then the Home nav item
  cy.wait(1000)
  cy.contains("Design").click()
  cy.get(".spectrum-Search").type("/")
  cy.get(".nav-item").contains("home").click()
})

Cypress.Commands.add("navigateToDataSection", () => {
  // Clicks on the Data tab
  cy.wait(500)
  cy.contains("Data").click()
})

//Blank
Cypress.Commands.add("createScreen", (route, accessLevelLabel) => {
  cy.contains("Design").click()
  cy.get("[aria-label=AddCircle]").click()
  cy.get(".spectrum-Modal").within(() => {
    cy.get("[data-cy='blank-screen']").click()
    cy.get(".spectrum-Button").contains("Continue").click({ force: true })
    cy.wait(500)
  })
  cy.get(".spectrum-Dialog-grid").within(() => {
    cy.get(".spectrum-Form-itemField").eq(0).type(route)
    cy.get(".spectrum-Button").contains("Continue").click({ force: true })
    cy.wait(1000)
  })

  cy.get(".spectrum-Modal").within(() => {
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
    cy.get("[aria-label=AddCircle]").click()
    cy.get(".spectrum-Modal").within(() => {
      cy.get(".item").contains("Autogenerated screens").click()
      cy.get(".spectrum-Button").contains("Continue").click({ force: true })
      cy.wait(500)
    })
    cy.get(".spectrum-Modal [data-cy='data-source-modal']").within(() => {
      for (let i = 0; i < datasourceNames.length; i++) {
        cy.get(".data-source-entry").contains(datasourceNames[i]).click()
        //Ensure the check mark is visible
        cy.get(".data-source-entry")
          .contains(datasourceNames[i])
          .get(".data-source-check")
          .should("exist")
      }

      cy.get(".spectrum-Button").contains("Confirm").click({ force: true })
    })

    cy.get(".spectrum-Modal").within(() => {
      if (accessLevelLabel) {
        cy.get(".spectrum-Picker-label").click()
        cy.wait(500)
        cy.contains(accessLevelLabel).click()
      }
      cy.get(".spectrum-Button").contains("Done").click({ force: true })
    })

    cy.contains("Design").click()
  }
)

Cypress.Commands.add("navigateToAutogeneratedModal", () => {
  // Screen name must already exist within data source
  cy.contains("Design").click()
  cy.get("[aria-label=AddCircle]").click()
  cy.get(".spectrum-Modal").within(() => {
    cy.get(".item").contains("Autogenerated screens").click()
    cy.get(".spectrum-Button").contains("Continue").click({ force: true })
    cy.wait(500)
  })
})

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

Cypress.Commands.add("addRow", values => {
  cy.contains("Create row").click()
  cy.get(".spectrum-Modal").within(() => {
    for (let i = 0; i < values.length; i++) {
      cy.get("input").eq(i).type(values[i]).blur()
    }
    cy.get(".spectrum-ButtonGroup").contains("Create").click()
  })
})

Cypress.Commands.add("expandBudibaseConnection", () => {
  if (Cypress.$(".nav-item > .content > .opened").length === 0) {
    // expand the Budibase DB connection string
    cy.get(".icon.arrow").eq(0).click()
  }
})

Cypress.Commands.add("selectTable", tableName => {
  cy.expandBudibaseConnection()
  cy.contains(".nav-item", tableName).click()
})

Cypress.Commands.add("addCustomSourceOptions", totalOptions => {
  cy.get(".spectrum-ActionButton")
    .contains("Define Options")
    .click()
    .then(() => {
      for (let i = 0; i < totalOptions; i++) {
        // Add radio button options
        cy.get(".spectrum-Button")
          .contains("Add Option")
          .click({ force: true })
          .then(() => {
            cy.wait(500)
            cy.get("[placeholder='Label']").eq(i).type(i)
            cy.get("[placeholder='Value']").eq(i).type(i)
          })
      }
      // Save options
      cy.get(".spectrum-Button").contains("Save").click({ force: true })
    })
})

//Filters visible with 1 or more
Cypress.Commands.add("searchForApplication", appName => {
  cy.visit(`${Cypress.config().baseUrl}/builder`)
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
            cy.get("input").eq(0).clear()
            cy.get("input").eq(0).type(appName)
          })
        })
      }
    })
})

//Assumes there are no others
Cypress.Commands.add("applicationInAppTable", appName => {
  cy.get(".appTable").within(() => {
    cy.get(".title").contains(appName).should("exist")
  })
})

Cypress.Commands.add("createAppFromScratch", appName => {
  cy.get(`[data-cy="create-app-btn"]`)
    .contains("Start from scratch")
    .click({ force: true })
  cy.get(".spectrum-Modal").within(() => {
    cy.get("input").eq(0).type(appName).should("have.value", appName).blur()
    cy.get(".spectrum-ButtonGroup").contains("Create app").click()
    cy.wait(10000)
  })
  cy.createTable("Cypress Tests", true)
})

Cypress.Commands.add("selectExternalDatasource", datasourceName => {
  // Navigates to Data Section
  cy.navigateToDataSection()
  // Open Data Source modal
  cy.get(".nav").within(() => {
    cy.get(".add-button").click()
  })
  // Clicks specified datasource & continue
  cy.wait(1000)
  cy.get(".item-list").contains(datasourceName).click()
  cy.get(".spectrum-Dialog-grid").within(() => {
    cy.get(".spectrum-Button").contains("Continue").click({ force: true })
  })
})

Cypress.Commands.add("addDatasourceConfig", (datasource, skipFetch) => {
  // selectExternalDatasource should be called prior to this
  // Adds the config for specified datasource & fetches tables
  // Currently supports MySQL, PostgreSQL, Oracle
  // Host IP Address
  cy.wait(500)
  cy.get(".spectrum-Dialog-grid").within(() => {
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
    cy.get(".spectrum-Dialog-grid").within(() => {
      cy.get(".spectrum-Button")
        .contains("Save and fetch tables")
        .click({ force: true })
      cy.wait(1000)
    })
  }
})

Cypress.Commands.add("createRestQuery", (method, restUrl, queryPrettyName) => {
  // addExternalDatasource should be called prior to this
  // Configures REST datasource & sends query
  cy.wait(1000)
  cy.get(".spectrum-Button").contains("Add query").click({ force: true })
  // Select Method & add Rest URL
  cy.get(".spectrum-Picker-label").eq(1).click()
  cy.get(".spectrum-Menu").contains(method).click()
  cy.get("input").clear().type(restUrl)
  // Send query
  cy.get(".spectrum-Button").contains("Send").click({ force: true })
  cy.wait(500)
  cy.get(".spectrum-Button").contains("Save").click({ force: true })
  cy.get(".hierarchy-items-container")
    .should("contain", method)
    .and("contain", queryPrettyName)
})
