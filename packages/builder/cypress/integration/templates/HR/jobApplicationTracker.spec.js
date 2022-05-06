import filterTests from "../../../support/filterTests"

filterTests(["all"], () => {
  context("Job Application Functionality", () => {
    const templateName = "Job Application Tracker"
    const templateNameParsed = templateName.toLowerCase().replace(/\s+/g, '-')
    
    before(() => {
        cy.login()
        cy.deleteApp(templateName)
        cy.visit(`${Cypress.config().baseUrl}/builder`, {
            onBeforeLoad(win) {
                cy.stub(win, 'open')
            }
        })
        cy.wait(2000)

        // Template navigation
        cy.request(`${Cypress.config().baseUrl}/api/applications?status=all`)
        .its("body")
        .then(val => {
            if (val.length > 0) {
            cy.get(".spectrum-Button").contains("Templates").click({force: true})
            }
        })
        })

    it("should create and publish app with Job Application Tracker template", () => {
        // Select Job Application Tracker template
        cy.get(".template-thumbnail-text")
            .contains(templateName).parentsUntil(".template-grid").within(() => {
                cy.get(".spectrum-Button").contains("Use template").click({ force: true })
            })

        // Confirm URL matches template name
        const appUrl = cy.get(".app-server")
        appUrl.invoke('text').then(appUrlText => {
            expect(appUrlText).to.equal(`${Cypress.config().baseUrl}/app/` + templateNameParsed)
        })

        // Create App
        cy.get(".spectrum-Dialog-grid").within(() => {
            cy.get(".spectrum-Button").contains("Create app").click({ force: true })
        })

        // Publish App
        cy.wait(2000) // Wait for app to generate
        cy.get(".toprightnav").contains("Publish").click({ force: true })
        cy.get(".spectrum-Dialog-grid").within(() => {
            cy.get(".spectrum-Button").contains("Publish").click({ force: true })
        })

        // Verify Published app
        cy.wait(2000) // Wait for App to publish and modal to appear
        cy.get(".spectrum-Dialog-grid").within(() => {
            cy.get(".spectrum-Button").contains("View App").click({ force: true })
            cy.window().its('open').should('be.calledOnce')
        })
    })

    it("should add active/inactive vacancies", () => {
        // Visit published app
        cy.visit(`${Cypress.config().baseUrl}/app/` + templateNameParsed)

        // loop for active/inactive vacancies
        for (let i = 0; i < 2; i++) {
            // Vacancies section
            cy.get(".links").contains("Vacancies").click({ force: true })
            cy.get(".spectrum-Button").contains("Create New").click()

            // Add inactive vacancy
            // Title
            cy.get('[data-name="Title"]').within(() => {
                cy.get(".spectrum-Textfield").type("Tester")
            })

            // Closing Date
            cy.get('[data-name="Closing date"]').within(() => {
                cy.get('[aria-label=Calendar]').click({ force: true })
            })
            cy.get("[aria-current=date]").click()

            // Department
            cy.get('[data-name="Department"]').within(() => {
                cy.get(".spectrum-Picker-label").click()
            })
            cy.get(".spectrum-Menu").find('li').its('length').then(len => {
                cy.get(".spectrum-Menu-item").eq(Math.floor(Math.random() * len)).click()
            })

            // Employment Type
            cy.get('[data-name="Employment type"]').within(() => {
                cy.get(".spectrum-Picker-label").click()
            })
            cy.get(".spectrum-Menu").find('li').its('length').then(len => {
                cy.get(".spectrum-Menu-item").eq(Math.floor(Math.random() * len)).click()
            })

            // Salary
            cy.get('[data-name="Salary ($)"]').within(() => {
                cy.get(".spectrum-Textfield").type(40000)
            })

            // Description
            cy.get('[data-name="Description"]').within(() => {
                cy.get(".spectrum-Textfield").type("description")
            })

            // Responsibilities
            cy.get('[data-name="Responsibilities"]').within(() => {
                cy.get(".spectrum-Textfield").type("Responsibilities")
            })

            // Requirements
            cy.get('[data-name="Requirements"]').within(() => {
                cy.get(".spectrum-Textfield").type("Requirements")
            })

            // Hiring manager
            cy.get('[data-name="Hiring manager"]').within(() => {
                cy.get(".spectrum-Picker-label").click()
            })
            cy.get(".spectrum-Menu").find('li').its('length').then(len => {
                cy.get(".spectrum-Menu-item").eq(Math.floor(Math.random() * len)).click()
            })

            // Active
            if (i == 0) {
                cy.get('[data-name="Active"]').within(() => {
                    cy.get(".spectrum-Checkbox-box").click({ force: true })
                })
            }

            // Location
            cy.get('[data-name="Location"]').within(() => {
                cy.get(".spectrum-Picker-label").click()
            })
            cy.get(".spectrum-Menu").find('li').its('length').then(len => {
                cy.get(".spectrum-Menu-item").eq(Math.floor(Math.random() * len)).click()
            })

            // Save vacancy
            cy.get(".spectrum-Button").contains("Save").click({ force: true })
            cy.wait(1000)

            // Check table was updated
            cy.get('[data-name="Vacancies Table"]').eq(i).should('contain', 'Tester')
        }
        })

    xit("should filter applications by stage", () => {
        // Visit published app
        cy.visit(`${Cypress.config().baseUrl}/app/` + templateNameParsed)
        cy.wait(1000)

        // Applications section
        cy.get(".links").contains("Applications").click({ force: true })
        cy.wait(1000)

        // Filter by stage - Confirm table updates
        cy.get(".spectrum-Picker").contains("Filter by stage").click({ force: true })
        cy.get(".spectrum-Menu").find('li').its('length').then(len => {
            for (let i = 1; i < len; i++) {
                cy.get(".spectrum-Menu-item").eq(i).click()
                const stage = cy.get(".spectrum-Picker-label")
                stage.invoke('text').then(stageText => {
                    if (stageText == "1st interview") {
                        cy.get(".placeholder").should('contain', 'No rows found')
                    }
                    else {
                        cy.get(".spectrum-Table-row").should('contain', stageText)
                    }
                    cy.get(".spectrum-Picker").contains(stageText).click({ force: true })
                })
            }
        })
    })

    xit("should edit an application", () => {
        // Switch application from not hired to hired
        // Visit published app
        cy.visit(`${Cypress.config().baseUrl}/app/` + templateNameParsed)
        cy.wait(1000)

        // Not Hired section
        cy.get(".links").contains("Not hired").click({ force: true })
        cy.wait(500)

        // View application
        cy.get(".spectrum-Table").within(() => {
            cy.get(".spectrum-Button").contains("View").click({ force: true })
            cy.wait(500)
        })

        // Update value for 'Staged'
        cy.get('[data-name="Stage"]').within(() => {
            cy.get(".spectrum-Picker-label").click()
        })
        cy.get(".spectrum-Menu").within(() => {
            cy.get(".spectrum-Menu-item").contains("Hired").click()
        })

        // Save application
        cy.get(".spectrum-Button").contains("Save").click({ force: true })
        cy.wait(500)

        // Hired section
        cy.get(".links").contains("Hired").click({ force: true })
        cy.wait(500)

        // Verify Table size - Total rows = 2
        cy.get(".spectrum-Table").find(".spectrum-Table-row").its('length').then((len => {
            expect(len).to.eq(2)
        }))
    })

    xit("should delete an application", () => {
        // Visit published app
        cy.visit(`${Cypress.config().baseUrl}/app/` + templateNameParsed)
        cy.wait(1000)

        // Hired section
        cy.get(".links").contains("Hired").click({ force: true })
        cy.wait(500)

        // View first application
        cy.get(".spectrum-Table-row").eq(0).within(() => {
            cy.get(".spectrum-Button").contains("View").click({ force: true })
            cy.wait(500)
        })

        // Delete application
        cy.get(".spectrum-Button").contains("Delete").click({ force: true })
        cy.get(".spectrum-Dialog-grid").within(() => {
            cy.get(".spectrum-Button").contains("Confirm").click()
        })
    })
    })
})
