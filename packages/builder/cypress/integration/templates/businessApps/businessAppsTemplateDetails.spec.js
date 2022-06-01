import filterTests from "../../../support/filterTests"

filterTests(["all"], () => {
  context("Verify Business Apps Template Details", () => {

    before(() => {
      cy.login()

      // Template navigation
      cy.visit(`${Cypress.config().baseUrl}/builder/portal/apps/templates`)
      
      // Filter Business Apps Templates
      cy.get(".template-category-filters").within(() => {
        cy.get('[data-cy="Business Apps"]').click()
      })
    })

  it("should verify the details option for Business Apps templates", () => {
    cy.get(".template-grid").find(".template-card").its('length')
    .then(len => {
        // Verify template name is within details link
      for (let i = 0; i < len; i++) {
        cy.get(".template-card").eq(i).within(() => {
          const templateName = cy.get(".template-thumbnail-text")
          templateName.invoke('text')
          .then(templateNameText => {
            const templateNameParsed = templateNameText.toLowerCase().replace(/\s+/g, '-')
            
            if (templateNameText == "Employee Check-in/Check-Out Template") {
                // Remove / from template name
                const templateNameReplace = templateNameParsed.replace(/\//g, "-")
                cy.get('a')
                .should('have.attr', 'href').and('contain', templateNameReplace)
            }
            else {
                cy.get('a').should('have.attr', 'href').and('contain', templateNameParsed)
            }
          })
          // Verify correct status from Details link - 200
          cy.get('a')
          .then(link => {
            cy.request(link.prop('href'))
            .its('status')
            .should('eq', 200)
          })
        })
      }
    })
  })
})
})
