import filterTests from "../support/filterTests"

filterTests(['all'], () => {
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

    it("should add a container", () => {
      cy.addComponent("Layout", "Container").then(componentId => {
        cy.getComponent(componentId).should("exist")
      })
    })

    it("should add a headline", () => {
      cy.addComponent("Elements", "Headline").then(componentId => {
        headlineId = componentId
        cy.getComponent(headlineId).should("exist")
      })
    })

    it("should change the text of the headline", () => {
      const text = "Lorem ipsum dolor sit amet."
      cy.get("[data-cy=setting-text] input")
        .type(text)
        .blur()
      cy.getComponent(headlineId).should("have.text", text)
    })

    it("should change the size of the headline", () => {
      cy.get("[data-cy=setting-size]").scrollIntoView().click()
      cy.get("[data-cy=setting-size]").within(() => {
        cy.get(".spectrum-Form-item li.spectrum-Menu-item").contains("3XL").click()
      })
      
      cy.getComponent(headlineId).within(() => {
        cy.get(".spectrum-Heading").should("have.css", "font-size", "60px")
      })
    })

    it("should create a form and reset to match schema", () => {
      cy.addComponent("Form", "Form").then(() => {
        cy.get("[data-cy=setting-dataSource]")
          .contains("Custom")
          .click()
        cy.get(".dropdown")
          .contains("dog")
          .click()
        cy.addComponent("Form", "Field Group").then(fieldGroupId => {
          cy.contains("Update form fields").click()
          cy.get(".spectrum-Modal")
            .get(".confirm-wrap .spectrum-Button")
            .click()
          cy.wait(500)
          cy.getComponent(fieldGroupId).within(() => {
            cy.contains("name").should("exist")
            cy.contains("age").should("exist")
            cy.contains("breed").should("exist")
          })
          cy.getComponent(fieldGroupId)
            .find("input")
            .should("have.length", 2)
          cy.getComponent(fieldGroupId)
            .find(".spectrum-Picker")
            .should("have.length", 1)
        })
      })
    })

    it("deletes a component", () => {
      cy.addComponent("Elements", "Paragraph").then(componentId => {
        cy.get("[data-cy=setting-_instanceName] input")
          .type(componentId)
          .blur()
        cy.get(".nav-items-container .nav-item.selected .actions > div > .icon").click({
          force: true,
        })
        cy.get(".spectrum-Popover.is-open li")
          .contains("Delete")
          .click()
        cy.get(".spectrum-Modal button")
          .contains("Delete Component")
          .click({
            force: true,
          })
        cy.getComponent(componentId).should("not.exist")
      })
    })

    it("should set focus to the field setting when fields are added to a form", () => {
      cy.addComponent("Form", "Form").then(() => {
        cy.get("[data-cy=setting-dataSource]")
          .contains("Custom")
          .click()
        cy.get(".dropdown")
          .contains("dog")
          .click()
        
        const componentTypeLabels = ["Text Field", "Number Field", "Password Field", 
          "Options Picker", "Checkbox", "Long Form Field", "Date Picker", "Attachment", 
          "JSON Field", "Multi-select Picker", "Relationship Picker"]

        const refocusTest = (componentId) => {
          let inputClasses

          cy.getComponent(componentId)
          .find(".showMe").should("exist").click({ force: true })
          
          cy.get("[data-cy=setting-field] .spectrum-InputGroup")
          .should("have.class", "is-focused").within(() => {
            cy.get("input").should(($input) => {
              inputClasses = Cypress.$($input).attr('class')
            })
          })
        }

        const testFieldFocusOnCreate = (componentLabel) => {
          let inputClasses
          cy.log("Adding: " + componentLabel)
          cy.addComponent("Form", componentLabel).then((componentId) => {
           
            refocusTest(componentId)

            cy.get("[data-cy=setting-field] .spectrum-InputGroup")
            .should("have.class", "is-focused").within(() => {
              cy.get("input").should(($input) => {
                inputClasses = Cypress.$($input).attr('class')
              })
            })
          })
        }

        componentTypeLabels.forEach( testFieldFocusOnCreate )

      })
    })
  })
})
