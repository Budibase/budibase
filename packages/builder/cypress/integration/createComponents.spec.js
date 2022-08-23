import filterTests from "../support/filterTests"
const interact = require("../support/interact")

filterTests(["all"], () => {
  context("Create Components", () => {
    let headlineId

    before(() => {
      cy.login()
      cy.createTestApp()
      cy.createTable("dog")
      cy.addColumn("dog", "name", "Text")
      cy.addColumn("dog", "age", "Number")
      cy.addColumn("dog", "breed", "Options")

      cy.navigateToFrontend()
      cy.wait(1000) //allow the iframe some wiggle room
    })

    //Use the tree to delete a selected component
    const deleteSelectedComponent = () => {
      cy.get(
        ".nav-items-container .nav-item.selected .actions > div > .icon"
      ).click({
        force: true,
      })
      cy.get(".spectrum-Popover.is-open li").contains("Delete").click()
      cy.get(".spectrum-Modal button").contains("Delete Component").click({
        force: true,
      })
    }

    it("should add a container", () => {
      cy.searchAndAddComponent("Container").then(componentId => {
        cy.getComponent(componentId).should("exist")
      })
    })

    it("should add a headline", () => {
      cy.searchAndAddComponent("Headline").then(componentId => {
        headlineId = componentId
        cy.getComponent(headlineId).should("exist")
      })
    })

    it("should change the text of the headline", () => {
      const text = "Lorem ipsum dolor sit amet."
      cy.get("[data-cy=setting-text] input").type(text).blur()
      cy.getComponent(headlineId).should("have.text", text)
    })

    it("should change the size of the headline", () => {
      cy.get("[data-cy=setting-size]").scrollIntoView().click()
      cy.get("[data-cy=setting-size]").within(() => {
        cy.get(".spectrum-Form-item li.spectrum-Menu-item")
          .contains("3XL")
          .click()
      })

      cy.getComponent(headlineId).within(() => {
        cy.get(".spectrum-Heading").should("have.css", "font-size", "60px")
      })
    })

    it("should create a form and reset to match schema", () => {
      cy.searchAndAddComponent("Form").then(() => {
        cy.get("[data-cy=setting-dataSource]").contains("Custom").click()
        cy.get(interact.DROPDOWN).contains("dog").click()
        cy.wait(500)
        cy.searchAndAddComponent("Field Group").then(fieldGroupId => {
          cy.contains("Update form fields").click()
          cy.get(".spectrum-Modal")
            .get(".confirm-wrap .spectrum-Button")
            .click()
          cy.wait(500)
          cy.getComponent(fieldGroupId).within(() => {
            cy.contains("name").should("exist")
            cy.contains("age").should("exist")
            cy.contains("breed").should("exist")
            // cy.contains("image").should("exist")
          })
          cy.getComponent(fieldGroupId).find("input").should("have.length", 2)
          cy.getComponent(fieldGroupId)
            .find(interact.SPECTRUM_PICKER)
            .should("have.length", 1)
        })
      })
    })

    it("deletes a component", () => {
      cy.searchAndAddComponent("Paragraph").then(componentId => {
        cy.get("[data-cy=setting-_instanceName] input").type(componentId).blur()
        cy.get(
          ".nav-items-container .nav-item.selected .actions > div > .icon"
        ).click({
          force: true,
        })
        cy.get(".spectrum-Popover.is-open li").contains("Delete").click()
        cy.get(".spectrum-Modal button").contains("Delete Component").click({
          force: true,
        })
        cy.getComponent(componentId).should("not.exist")
      })
    })

    it("should clear the iframe place holder when a form field has been set", () => {
      cy.searchAndAddComponent("Form").then(formId => {
        //For deletion
        cy.get("[data-cy=setting-_instanceName] input")
          .clear()
          .type(formId)
          .blur()
        cy.get("[data-cy=setting-dataSource]").contains("Custom").click()
        cy.get(".dropdown").contains("dog").click()

        const fieldTypeToColumnName = {
          "Text Field": "name",
          "Number Field": "age",
          "Options Picker": "breed",
        }

        const componentTypeLabels = Object.keys(fieldTypeToColumnName)

        const testFieldFocusOnCreate = componentLabel => {
          cy.log("Adding: " + componentLabel)
          return cy.searchAndAddComponent(componentLabel).then(componentId => {
            cy.get("[data-cy=setting-field] button.spectrum-Picker").click()

            //Click the first appropriate field. They are filtered by type
            cy.get(
              "[data-cy=setting-field] .spectrum-Popover.is-open li.spectrum-Menu-item"
            )
              .contains(fieldTypeToColumnName[componentLabel])
              .click()
            cy.wait(500)
            cy.getComponent(componentId)
              .find(".component-placeholder")
              .should("not.exist")
          })
        }

        cy.wait(500)
        cy.wrap(componentTypeLabels)
          .each(label => {
            return testFieldFocusOnCreate(label)
          })
          .then(() => {
            cy.get(".nav-items-container .nav-item")
              .contains(formId)
              .click({ force: true })
            deleteSelectedComponent()
          })
      })
    })

    it("should populate the provider for charts with a data provider in its path", () => {
      cy.searchAndAddComponent("Data Provider").then(providerId => {
        //For deletion
        cy.get("[data-cy=setting-_instanceName] input")
          .clear()
          .type(providerId)
          .blur()
        cy.get("[data-cy=setting-dataSource]")
          .contains("Choose an option")
          .click()
        cy.get(`[data-cy=dataSource-popover-${providerId}] ul li`)
          .contains("dog")
          .click()

        const chartTypeLabels = [
          "Bar Chart",
          "Line Chart",
          "Area Chart",
          "Pie Chart",
          "Donut Chart",
          "Candlestick Chart",
        ]

        const testFocusOnCreate = chartLabel => {
          cy.log("Adding: " + chartLabel)
          cy.searchAndAddComponent(chartLabel).then(componentId => {
            cy.get(
              "[data-cy=dataProvider-prop-control] .spectrum-Picker"
            ).should("not.have.class", "is-focused")

            // Pre populated.
            cy.get("[data-cy=dataProvider-prop-control] .spectrum-Picker-label")
              .contains(providerId)
              .should("exist")
          })
        }
        cy.wait(1000)
        cy.wrap(chartTypeLabels)
          .each(label => {
            return testFocusOnCreate(label)
          })
          .then(() => {
            cy.get(".nav-items-container .nav-item")
              .contains(providerId)
              .click({ force: true })
            deleteSelectedComponent()
          })
      })
    })

    it("should replace the placeholder when a url is set on an image", () => {
      cy.searchAndAddComponent("Image").then(imageId => {
        cy.get("[data-cy=setting-_instanceName] input")
          .clear()
          .type(imageId)
          .blur()
        //return $("New Data Provider.Rows")[0]["Attachment"][0]["url"]
        //No minio, so just enter something local that will not reslove
        cy.get("[data-cy=url-prop-control] input[type=text]")
          .type("cypress/fixtures/ghost.png")
          .blur()
        cy.getComponent(imageId)
          .find(".component-placeholder")
          .should("not.exist")
        cy.getComponent(imageId).find(`img[alt=${imageId}]`).should("exist")
        cy.get(".nav-items-container .nav-item")
          .contains(imageId)
          .click({ force: true })
        deleteSelectedComponent()
      })
    })

    it("should add a markdown component.", () => {
      cy.searchAndAddComponent("Markdown Viewer").then(markdownId => {
        cy.get("[data-cy=setting-_instanceName] input")
          .clear()
          .type(markdownId)
          .blur()
        cy.get(
          "[data-cy=value-prop-control] input[type=text].spectrum-Textfield-input"
        )
          .type("# Hi")
          .blur()
        cy.getComponent(markdownId)
          .find(".component-placeholder")
          .should("not.exist")
        cy.getComponent(markdownId)
          .find(".editor-preview-full h1")
          .contains("Hi")
        cy.get(".nav-items-container .nav-item")
          .contains(markdownId)
          .click({ force: true })
        deleteSelectedComponent()
      })
    })

    it("should direct the user when adding an Icon component.", () => {
      cy.searchAndAddComponent("Icon").then(iconId => {
        cy.get("[data-cy=setting-_instanceName] input")
          .clear()
          .type(iconId)
          .blur()
        cy.get("[data-cy=icon-prop-control] .spectrum-ActionButton").click()
        cy.get("[data-cy=icon-popover].spectrum-Popover.is-open").within(() => {
          cy.get(".search-input input").type("save").blur()
          cy.get(".search-input button").click({ force: true })
          cy.get(".icon-area .icon-container").eq(0).click({ force: true })
        })
        cy.getComponent(iconId)
          .find(".component-placeholder")
          .should("not.exist")
        cy.getComponent(iconId).find("i.ri-save-fill").should("exist")
        cy.get(".nav-items-container .nav-item")
          .contains(iconId)
          .click({ force: true })
        deleteSelectedComponent()
      })
    })
  })
})
