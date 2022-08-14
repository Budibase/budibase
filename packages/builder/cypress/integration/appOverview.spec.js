import filterTests from "../support/filterTests"
import clientPackage from "@budibase/client/package.json"

filterTests(["all"], () => {
  context("Application Overview screen", () => {
    before(() => {
      cy.login()
      cy.deleteAllApps()
      cy.createApp("Cypress Tests")
    })

    it("Should be accessible from the applications list", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .title")
        .eq(0)
        .invoke("attr", "data-cy")
        .then($dataCy => {
          const dataCy = $dataCy
          cy.get(".appTable .app-row-actions button")
            .contains("Manage")
            .click({ force: true })

          cy.location().should(loc => {
            expect(loc.pathname).to.eq("/builder/portal/overview/" + dataCy)
          })
        })
    })

    // Find a more suitable place for this.
    it("Should allow unlocking in the app list", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.get(".appTable .lock-status").eq(0).contains("Locked by you").click()

      cy.unlockApp({ owned: true })

      cy.get(".appTable").should("exist")
      cy.get(".lock-status").should("not.be.visible")
    })

    it("Should allow unlocking in the app overview screen", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.get(".appTable .app-row-actions button")
        .contains("Edit")
        .eq(0)
        .click({ force: true })
      cy.wait(1000)
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.get(".lock-status").eq(0).contains("Locked by you").click()

      cy.unlockApp({ owned: true })

      cy.get(".lock-status").should("not.be.visible")
    })

    it("Should reflect the deploy state of an app that hasn't been published.", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)

      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.get(".header-right button.spectrum-Button[data-cy='view-app']").should(
        "be.disabled"
      )

      cy.get(".spectrum-Tabs-item.is-selected").contains("Overview")
      cy.get(".overview-tab").should("be.visible")

      cy.get(".overview-tab [data-cy='app-status']").within(() => {
        cy.get(".status-display").contains("Unpublished")
        cy.get(".status-display .icon svg[aria-label='GlobeStrike']").should(
          "exist"
        )
        cy.get(".status-text").contains("-")
      })
    })

    it("Should reflect the app deployment state", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000 })
      cy.get(".appTable .app-row-actions button")
        .contains("Edit")
        .eq(0)
        .click({ force: true })

      cy.wait(500)
      cy.get(".toprightnav button.spectrum-Button", { timeout: 2000 })
        .contains("Publish")
        .click({ force: true })
      cy.get(".spectrum-Modal [data-cy='deploy-app-modal']")
        .should("be.visible")
        .within(() => {
          cy.get(".spectrum-Button").contains("Publish").click({ force: true })
          cy.wait(1000)
        })

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.get(".header-right button.spectrum-Button[data-cy='view-app']").should(
        "not.be.disabled"
      )

      cy.get(".overview-tab [data-cy='app-status']").within(() => {
        cy.get(".status-display").contains("Published")
        cy.get(".status-display .icon svg[aria-label='GlobeCheck']").should(
          "exist"
        )
        cy.get(".status-text").contains("Last published a few seconds ago")
      })
    })

    it("Should reflect an application that has been unpublished", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button")
        .contains("Edit")
        .eq(0)
        .click({ force: true })

      cy.get(".deployment-top-nav svg[aria-label='Globe']").click({
        force: true,
      })

      cy.get("[data-cy='publish-popover-menu']").should("be.visible")
      cy.get(
        "[data-cy='publish-popover-menu'] [data-cy='publish-popover-action']"
      ).click({ force: true })

      cy.get("[data-cy='unpublish-modal']")
        .should("be.visible")
        .within(() => {
          cy.get(".confirm-wrap button").click({ force: true })
        })

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.get(".overview-tab [data-cy='app-status']").within(() => {
        cy.get(".status-display").contains("Unpublished")
        cy.get(".status-display .icon svg[aria-label='GlobeStrike']").should(
          "exist"
        )
        cy.get(".status-text").contains("Last published a few seconds ago")
      })
    })

    it("Should allow the editing of the application icon and colour", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.get(".edit-hover", { timeout: 1000 }).eq(0).click({ force: true })
      // Select random icon
      cy.wait(400)
      cy.get(".grid").within(() => {
        cy.get(".icon-item")
          .eq(Math.floor(Math.random() * 23) + 1)
          .click()
      })
      // Select random colour
      cy.get(".fill").click()
      cy.get(".colors").within(() => {
        cy.get(".color")
          .eq(Math.floor(Math.random() * 33) + 1)
          .click()
      })
      cy.intercept("**/applications/**").as("iconChange")
      cy.get(".spectrum-Button").contains("Save").click({ force: true })
      cy.wait("@iconChange")
      cy.get("@iconChange").its("response.statusCode").should("eq", 200)
      // Confirm icon has changed from default
      // Confirm colour has been applied
      cy.get(".spectrum-ActionButton-label").contains("Back").click({ force: true })
      cy.get(".appTable", { timeout: 2000 }).within(() => {
        cy.get("[aria-label]")
          .eq(0)
          .children()
          .should("have.attr", "xlink:href")
          .and("not.contain", "#spectrum-icon-18-Apps")
        cy.get(".title")
          .children()
          .children()
          .should("have.attr", "style")
          .and("contains", "color")
      })
    })

    it("Should reflect the last time the application was edited", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.get(".header-right button").contains("Edit").click({ force: true })

      cy.navigateToFrontend()

      cy.searchAndAddComponent("Headline").then(componentId => {
        cy.getComponent(componentId).should("exist")
      })

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.get(".overview-tab [data-cy='edited-by']").within(() => {
        cy.get(".editor-name").contains("You")
        cy.get(".last-edit-text").contains("Last edited a few seconds ago")
      })
    })

    it("Should reflect application version is up-to-date", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.get(".overview-tab [data-cy='app-version']").within(() => {
        cy.get(".version-status").contains("You're running the latest!")
      })
    })

    it("Should navigate to the settings tab when clicking the App Version card header", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.get(".spectrum-Tabs-item.is-selected").contains("Overview")
      cy.get(".overview-tab").should("be.visible")

      cy.get(".overview-tab [data-cy='app-version'] .dash-card-header").click({
        force: true,
      })

      cy.get(".spectrum-Tabs-item.is-selected").contains("Settings")
      cy.get(".settings-tab").should("be.visible")
      cy.get(".overview-tab").should("not.exist")
    })

    it("Should allow the upgrading of an application, if available.", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.wait(500)

      cy.location().then(loc => {
        const params = loc.pathname.split("/")
        const appId = params[params.length - 1]
        cy.log(appId)
        //Downgrade the app for the test
        cy.alterAppVersion(appId, "0.0.1-alpha.0").then(() => {
          cy.reload()
          cy.log("Current deployment version: " + clientPackage.version)

          cy.get(".version-status a", { timeout: 5000 }).contains("Update").click()
          cy.get(".spectrum-Tabs-item.is-selected").contains("Settings")

          cy.get(".version-section .page-action button")
            .contains("Update")
            .click({ force: true })

          cy.intercept("POST", "**/applications/**/client/update").as(
            "updateVersion"
          )
          cy.get(".spectrum-Modal.is-open button")
            .contains("Update")
            .click({ force: true })

          cy.wait("@updateVersion")
            .its("response.statusCode")
            .should("eq", 200)
            .then(() => {
              cy.visit(`${Cypress.config().baseUrl}/builder`)
              cy.get(".appTable .app-row-actions button")
                .contains("Manage")
                .eq(0)
                .click({ force: true })
              cy.get(".spectrum-Tabs-item")
                .contains("Overview")
                .click({ force: true })
              cy.get(".overview-tab [data-cy='app-version']").within(() => {
                cy.get(".spectrum-Heading").contains(clientPackage.version)
                cy.get(".version-status").contains("You're running the latest!")
              })
            })
        })
      })
    })

    it("Should allow editing of the app details.", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000 })
      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.get(".spectrum-Tabs-item").contains("Settings").click()
      cy.get(".spectrum-Tabs-item.is-selected").contains("Settings")
      cy.get(".settings-tab").should("be.visible")

      cy.get(".details-section .page-action button")
        .contains("Edit")
        .click({ force: true })
      cy.updateAppName("sample name")

      //publish and check its disabled
      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 5000 })
      cy.wait(500)
      cy.get(".appTable .app-row-actions button")
        .contains("Edit")
        .eq(0)
        .click({ force: true })

      cy.get(".toprightnav button.spectrum-Button")
        .contains("Publish")
        .click({ force: true })
      cy.get(".spectrum-Modal [data-cy='deploy-app-modal']")
        .should("be.visible")
        .within(() => {
          cy.get(".spectrum-Button").contains("Publish").click({ force: true })
          cy.wait(1000)
        })

      cy.visit(`${Cypress.config().baseUrl}/builder`, { timeout: 10000 })
      cy.get(".appTable .app-row-actions button", { timeout: 5000 })
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.get(".spectrum-Tabs-item").contains("Settings").click()
      cy.get(".spectrum-Tabs-item.is-selected").contains("Settings")

      cy.get(".details-section .page-action .spectrum-Button").scrollIntoView()
      cy.get(".details-section .page-action .spectrum-Button", { timeout: 1000 }).should(
        "be.disabled"
      )
    })

    xit("Should allow copying of the published application Id", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions")
        .eq(0)
        .within(() => {
          cy.get(".spectrum-Button").contains("Edit").click({ force: true })
        })

      cy.publishApp("sample-name")

      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.get(".app-overview-actions-icon > .icon").click({ force: true })

      cy.get("[data-cy='app-overview-menu-popover']")
        .eq(0)
        .within(() => {
          cy.get(".spectrum-Menu-item")
            .contains("Copy App ID")
            .click({ force: true })
        })
      
      cy.get(".spectrum-Toast-content")
      .contains("App ID copied to clipboard.")
      .should("be.visible")
    })

    it("Should allow unpublishing of the application via the Unpublish link", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })

      cy.get(`[data-cy="app-status"]`).within(() => {
        cy.contains("Unpublish").click({ force: true })
        })

      cy.get("[data-cy='unpublish-modal']")
        .should("be.visible")
        .within(() => {
          cy.get(".confirm-wrap button").click({ force: true })
        })

      cy.get(".overview-tab [data-cy='app-status']").within(() => {
        cy.get(".status-display").contains("Unpublished")
        cy.get(".status-display .icon svg[aria-label='GlobeStrike']")
        .should("exist")
      })
    })

    it("Should allow deleting of the application", () => {
      cy.visit(`${Cypress.config().baseUrl}/builder`)
      cy.get(".appTable .app-row-actions button")
        .contains("Manage")
        .eq(0)
        .click({ force: true })
      cy.get(".app-overview-actions-icon > .icon").click({ force: true })

      cy.get("[data-cy='app-overview-menu-popover']")
        .eq(0)
        .within(() => {
          cy.get(".spectrum-Menu-item")
            .contains("Delete")
            .click({ force: true })
          cy.wait(500)
        })

      //The test application was renamed earlier in the spec
      cy.get(".spectrum-Dialog-grid").within(() => {
        cy.get("input").type("sample name")
        cy.get(".spectrum-Button--warning").click()
      })

      cy.location().should(loc => {
        expect(loc.pathname).to.eq("/builder/portal/apps")
      })

      cy.get(".appTable").should("not.exist")

      cy.get(".welcome .container h1").contains("Let's create your first app!")
    })

    after(() => {
      cy.deleteAllApps()
    })
  })
})
