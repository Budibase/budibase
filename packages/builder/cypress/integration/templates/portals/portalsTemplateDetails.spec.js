import filterTests from "../../../support/filterTests"

filterTests(["all"], () => {
  context("Verify Portals Template Details", () => {

    before(() => {
      cy.login()

      // Template navigation
      cy.visit(`${Cypress.config().baseUrl}/builder/portal/apps/templates`)

      // Filter Portal Templates
      cy.get(".template-category-filters").within(() => {
        cy.get('[data-cy="Portal"]').click()
    })
    })

  it("should verify the details option for Portal templates", () => {
    cy.get(".template-grid").find(".template-card").its('length')
    .then(len => {
      for (let i = 0; i < len; i++) {
        cy.get(".template-card").eq(i).within(() => {
          const templateName = cy.get(".template-thumbnail-text")
          templateName.invoke('text')
          .then(templateNameText => {
            const templateNameParsed = templateNameText.toLowerCase().replace(/\s+/g, '-')
            cy.get('a')
            .should('have.attr', 'href').and('contain', templateNameParsed)
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

  it("should verify the details option for Portals templates", () => {
    // Filter Portals Templates
    cy.get(".template-category-filters").within(() => {
        cy.get('[data-cy="Portals"]').click()
      })
    
    cy.get(".template-grid").find(".template-card").its('length')
    .then(len => {
      for (let i = 0; i < len; i++) {
        cy.get(".template-card").eq(i).within(() => {
          const templateName = cy.get(".template-thumbnail-text")
          templateName.invoke('text')
          .then(templateNameText => {
            const templateNameParsed = templateNameText.toLowerCase().replace(/\s+/g, '-')
            cy.get('a')
            .should('have.attr', 'href').and('contain', templateNameParsed)
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
