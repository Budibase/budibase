import filterTests from "../../support/filterTests"

filterTests(["all"], () => {
  context("MySQL Datasource Testing", () => {
    if (Cypress.env("TEST_ENV")) {
      before(() => {
        cy.login()
        cy.createTestApp()
      })
      const datasource = "MySQL"
      const queryName = "Cypress Test Query"
      const queryRename = "CT Query Rename"

      it("Should add MySQL datasource without configuration", () => {
        // Select MySQL datasource
        cy.selectExternalDatasource(datasource)
        // Attempt to fetch tables without applying configuration
        cy.intercept("**/datasources").as("datasource")
        cy.get(".spectrum-Button")
          .contains("Save and fetch tables")
          .click({ force: true })
          cy.wait(500)
        // Intercept Request after button click & apply assertions
        cy.wait("@datasource")
        cy.get("@datasource")
          .its("response.body")
          .should(
            "have.property",
            "message",
            "connect ECONNREFUSED 127.0.0.1:3306"
          )
        cy.get("@datasource")
          .its("response.body")
          .should("have.property", "status", 500)
        cy.get(".spectrum-Button").contains("Skip table fetch").click({ force: true })
      })

      it("should add MySQL datasource and fetch tables", () => {
        // Add & configure MySQL datasource
        cy.selectExternalDatasource(datasource)
        cy.intercept("**/datasources").as("datasource")
        cy.addDatasourceConfig(datasource)
        // Check response from datasource after adding configuration
        cy.wait("@datasource")
        cy.get("@datasource").its("response.statusCode").should("eq", 200)
        // Confirm fetch tables was successful
        cy.get(".spectrum-Table")
          .eq(0)
          .find(".spectrum-Table-row")
          .its("length")
          .should("be.gt", 0)
      })

      it("should check table fetching error", () => {
        // MySQL test datasource contains tables without primary keys
        cy.get(".spectrum-InLineAlert")
          .should("contain", "Error fetching tables")
          .and("contain", "No primary key constraint found")
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
        })
        // Save relationship & reload page
        cy.get(".spectrum-ButtonGroup").within(() => {
          cy.get(".spectrum-Button").contains("Save").click({ force: true })
        })
        cy.reload()

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
          cy.wait(1000)
        })
        // Confirm table length & relationship name
        cy.get(".spectrum-Table", { timeout: 1000 })
          .eq(1)
          .find(".spectrum-Table-row")
          .its("length")
          .should("eq", 2)
        cy.get(".spectrum-Table-cell").should(
          "contain",
          "LOCATIONS through COUNTRIES → REGIONS"
        )
      })

      it("should delete relationships", () => {
        // Delete both relationships
        cy.get(".spectrum-Table")
          .eq(1)
          .find(".spectrum-Table-row")
          .its("length")
          .then(len => {
            for (let i = 0; i < len; i++) {
              cy.get(".spectrum-Table")
                .eq(1)
                .within(() => {
                  cy.get(".spectrum-Table-cell").eq(0).click({ force: true })
                })
              cy.get(".spectrum-Dialog-grid", { timeout: 500 }).within(() => {
                cy.get(".spectrum-Button")
                  .contains("Delete")
                  .click({ force: true })
              })
              cy.reload()
              cy.wait(500)
            }
            // Confirm relationships no longer exist
            cy.get(".spectrum-Body").should(
              "contain",
              "No relationships configured"
            )
          })
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
        cy.intercept("POST", "**/queries").as("saveQuery")
        cy.get(".spectrum-Button").contains("Save Query").click({ force: true })
        cy.wait("@saveQuery")
        cy.get("@saveQuery").its("response.statusCode").should("eq", 200)
        cy.get(".nav-item").should("contain", queryName)
      })

      it("should duplicate a query", () => {
        /// Get query nav item - QueryName
        cy.get(".nav-item")
          .contains(queryName)
          .parent()
          .within(() => {
            cy.get(".spectrum-Icon").eq(1).click({ force: true })
          })
        // Select and confirm duplication
        cy.get(".spectrum-Menu").contains("Duplicate").click()
        cy.get(".nav-item").should("contain", queryName + " (1)")
      })

      it("should edit a query name", () => {
        // Rename query
        cy.get(".spectrum-Form-item")
          .eq(0)
          .within(() => {
            cy.get("input").clear().type(queryRename)
          })
        // Click on a nav item
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
        cy.get(".nav-item", { timeout: 1000 }).should("not.contain", queryRename)
      })
    }
  })
})
