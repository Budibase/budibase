import filterTests from "../../support/filterTests"

filterTests(["all"], () => {
  xcontext("PostgreSQL Datasource Testing", () => {
    if (Cypress.env("TEST_ENV")) {
      before(() => {
        cy.login()
        cy.createTestApp()
      })
      const datasource = "PostgreSQL"
      const queryName = "Cypress Test Query"
      const queryRename = "CT Query Rename"

      xit("Should add PostgreSQL datasource without configuration", () => {
        // Select PostgreSQL datasource
        cy.selectExternalDatasource(datasource)
        // Attempt to fetch tables without applying configuration
        cy.intercept("**/datasources").as("datasource")
        cy.get(".spectrum-Button")
          .contains("Save and fetch tables")
          .click({ force: true })
        // Intercept Request after button click & apply assertions
        cy.wait("@datasource")
        cy.get("@datasource")
          .its("response.body")
          .should("have.property", "status", 500)
        cy.get(".spectrum-Button").contains("Skip table fetch").click({ force: true })
      })

      it("should add PostgreSQL datasource and fetch tables", () => {
        // Add & configure PostgreSQL datasource
        cy.selectExternalDatasource(datasource)
        cy.intercept("**/datasources").as("datasource")
        cy.addDatasourceConfig(datasource)
        // Check response from datasource after adding configuration
        cy.wait("@datasource")
        cy.get("@datasource").its("response.statusCode").should("eq", 200)
        cy.wait(2000)
        // Confirm fetch tables was successful
        cy.get(".spectrum-Table")
          .eq(0)
          .find(".spectrum-Table-row")
          .its("length")
          .should("be.gt", 0)
      })

      it("should define a One relationship type", () => {
        // Select relationship type & configure
        cy.get(".spectrum-Button")
          .contains("Define relationship")
          .click({ force: true })
        cy.get(".spectrum-Dialog-grid").within(() => {
          cy.get(".spectrum-Picker").eq(0).click()
          cy.get(".spectrum-Popover").contains("One").click()
          cy.get(".spectrum-Picker").eq(1).click()
          cy.get(".spectrum-Popover").contains("REGIONS").click()
          cy.get(".spectrum-Picker").eq(2).click()
          cy.get(".spectrum-Popover").contains("REGION_ID").click()
          cy.get(".spectrum-Picker").eq(3).click()
          cy.get(".spectrum-Popover").contains("COUNTRIES").click()
          cy.get(".spectrum-Picker").eq(4).click()
          cy.get(".spectrum-Popover").contains("REGION_ID").click()
          // Save relationship & reload page
          cy.get(".spectrum-Button").contains("Save").click({ force: true })
          cy.reload()
        })
        // Confirm table length & column name
        cy.get(".spectrum-Table")
          .eq(1)
          .find(".spectrum-Table-row")
          .its("length")
          .should("eq", 1)
        cy.get(".spectrum-Table-cell").should("contain", "COUNTRIES to REGIONS")
      })

      it("should define a Many relationship type", () => {
        // Select relationship type & configure
        cy.get(".spectrum-Button")
          .contains("Define relationship")
          .click({ force: true })
        cy.get(".spectrum-Dialog-grid").within(() => {
          cy.get(".spectrum-Picker").eq(0).click()
          cy.get(".spectrum-Popover").contains("Many").click()
          cy.get(".spectrum-Picker").eq(1).click()
          cy.get(".spectrum-Popover").contains("LOCATIONS").click()
          cy.get(".spectrum-Picker").eq(2).click()
          cy.get(".spectrum-Popover").contains("REGIONS").click()
          cy.get(".spectrum-Picker").eq(3).click()
          cy.get(".spectrum-Popover").contains("COUNTRIES").click()
          cy.get(".spectrum-Picker").eq(4).click()
          cy.get(".spectrum-Popover").contains("COUNTRY_ID").click()
          cy.get(".spectrum-Picker").eq(5).click()
          cy.get(".spectrum-Popover").contains("REGION_ID").click()
          // Save relationship & reload page
          cy.get(".spectrum-Button").contains("Save").click({ force: true })
          cy.reload()
        })
        // Confirm table length & relationship name
        cy.get(".spectrum-Table")
          .eq(1)
          .find(".spectrum-Table-row")
          .its("length")
          .should("eq", 2)
        cy.get(".spectrum-Table-cell").should(
          "contain",
          "LOCATIONS through COUNTRIES → REGIONS"
        )
      })

      it("should delete a relationship", () => {
        cy.get(".hierarchy-items-container").contains("PostgreSQL").click({ force: true })
        cy.reload()
        // Delete one relationship
        cy.get(".spectrum-Table")
          .eq(1)
          .within(() => {
            cy.get(".spectrum-Table-cell").eq(0).click({ force: true })
          })
        cy.get(".spectrum-Dialog-grid", { timeout: 500 }).within(() => {
          cy.get(".spectrum-Button").contains("Delete").click({ force: true })
        })
        cy.reload()
        cy.wait(500)
        // Confirm relationship was deleted
        cy.get(".spectrum-Table")
          .eq(1)
          .find(".spectrum-Table-row")
          .its("length")
          .should("eq", 1)
      })

      it("should add a query", () => {
        // Add query
        cy.get(".spectrum-Button").contains("Add query").click({ force: true })
        cy.get(".spectrum-Form-item")
          .eq(0)
          .within(() => {
            cy.get("input").type(queryName)
          })
        // Insert Query within Fields section
        cy.get(".CodeMirror textarea")
          .eq(0)
          .type("SELECT * FROM books", { force: true })
        // Intercept query execution
        cy.intercept("**/queries/preview").as("query")
        cy.get(".spectrum-Button").contains("Run Query").click({ force: true })
        cy.wait(500)
        cy.wait("@query")
        // Assert against Status Code & Body
        cy.get("@query").its("response.statusCode").should("eq", 200)
        cy.get("@query").its("response.body").should("not.be.empty")
        // Save query
        cy.intercept("**/queries").as("saveQuery")
        cy.get(".spectrum-Button").contains("Save Query").click({ force: true })
        cy.wait("@saveQuery")
        cy.get(".spectrum-Tabs-content", { timeout: 2000 }).should("contain", queryName)
      })

      it("should switch to schema with no tables", () => {
        // Switch Schema - To one without any tables
        cy.get(".hierarchy-items-container").contains("PostgreSQL").click({ force: true })
        switchSchema("randomText")

        // No tables displayed
        cy.get(".spectrum-Body", { timeout: 10000 }).eq(2, { timeout: 10000 }).should("contain", "No tables found")

        // Previously created query should be visible
        cy.get(".spectrum-Table").should("contain", queryName)
      })

      it("should switch schemas", () => {
        // Switch schema - To one with tables
        switchSchema("1")

        // Confirm tables exist - Check for specific one
        cy.get(".spectrum-Table", { timeout: 20000 }).eq(0).should("contain", "test")
        cy.get(".spectrum-Table")
          .eq(0)
          .find(".spectrum-Table-row")
          .its("length")
          .should("eq", 1)

        // Confirm specific table visible within left nav bar
        cy.get(".hierarchy-items-container").should("contain", "test")

        // Switch back to public schema
        switchSchema("public")

        // Confirm tables exist - again
        cy.get(".spectrum-Table", { timeout: 20000 }).eq(0).should("contain", "REGIONS")
        cy.get(".spectrum-Table")
          .eq(0)
          .find(".spectrum-Table-row")
          .its("length")
          .should("be.gt", 1)

        // Confirm specific table visible within left nav bar
        cy.get(".hierarchy-items-container").should("contain", "REGIONS")

        // No relationships and one query
        cy.get(".spectrum-Body")
          .eq(3)
          .should("contain", "No relationships configured.")
        cy.get(".spectrum-Table").eq(1).should("contain", queryName)
      })

      it("should duplicate a query", () => {
        // Locate previously created query
        cy.get(".nav-item")
          .contains(queryName)
          .siblings(".actions")
          .within(() => {
            cy.get(".spectrum-Icon").click({ force: true })
          })
        // Select and confirm duplication
        cy.get(".spectrum-Menu").contains("Duplicate").click()
        cy.get(".nav-item").should("contain", queryName + " (1)")
      })

      it("should edit a query name", () => {
        // Access query
        cy.get(".hierarchy-items-container", { timeout: 2000 })
          //.contains(queryName + " (1)")
          .contains(queryName)
          .click({ force: true })

        // Rename query
        cy.wait(1000)
        cy.get(".spectrum-Form-item", { timeout: 2000 })
          .eq(0)
          .within(() => {
            cy.get("input").clear().type(queryRename)
          })

        // Click on a nav item and confirm name change
        cy.get(".nav-item").first().click()
        // Confirm name change
        cy.get(".nav-item").should("contain", queryRename)
      })

      it("should delete a query", () => {
        // Get query nav item - QueryName
        cy.get(".nav-item")
          .contains(queryRename)
          .parent()
          .within(() => {
            cy.get(".spectrum-Icon").eq(1).click({ force: true })
        })
        // Select Delete
        cy.get(".spectrum-Menu").contains("Delete").click()
        cy.get(".spectrum-Button")
          .contains("Delete Query")
          .click({ force: true })
        // Confirm deletion
        cy.reload()
        cy.get(".nav-item", { timeout: 30000 }).contains(datasource).click({ force: true })
        cy.get(".nav-item", { timeout: 1000 }).should("not.contain", queryRename)
      })

      const switchSchema = schema => {
        // Edit configuration - Change Schema
        cy.get(".spectrum-Textfield")
          .eq(6)
          .within(() => {
            cy.get("input").clear().type(schema)
          })
        // Save configuration & fetch
        cy.get(".spectrum-Button").contains("Save").click({ force: true })
        cy.get(".spectrum-Button")
          .contains("Fetch tables")
          .click({ force: true })
        // Click fetch tables again within modal
        cy.get(".spectrum-Dialog-grid").within(() => {
          cy.get(".spectrum-Button")
            .contains("Fetch tables")
            .click({ force: true })
        })
        cy.reload()
        cy.wait(1000)
      }
    }
  })
})
