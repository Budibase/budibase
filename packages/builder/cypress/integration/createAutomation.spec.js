import filterTests from "../support/filterTests"
const interact = require('../support/interact')

filterTests(['smoke', 'all'], () => {
  context("Create a automation", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
    })

    it("should create a automation", () => {
      cy.createTestTableWithData()
      cy.wait(2000)
      cy.contains("Automate").click()
      cy.get(interact.SPECTRUM_BUTTON_TEMPLATE).contains("Add automation").click({ force: true })
      cy.get(interact.MODAL_INNER_WRAPPER).within(() => {
        cy.get("input").type("Add Row")
        cy.contains("Row Created").click({ force: true })
        cy.get(interact.SPECTRUM_BUTTON_CTA, { timeout: 500 }).click()
      })

      // Setup trigger
      cy.get(interact.SPECTRUM_PICKER_LABEL).click()
      cy.wait(500)
      cy.contains("dog").click()
      // Create action
      cy.get('[aria-label="AddCircle"]', { timeout: 2000 }).click()
      cy.get(interact.MODAL_INNER_WRAPPER).within(() => {
        cy.wait(1000)
        cy.contains("Create Row").trigger('mouseover').click().click()
        cy.get(interact.SPECTRUM_BUTTON_CTA).click()
      })
      cy.get(interact.SPECTRUM_PICKER_LABEL).eq(1).click()
      cy.contains("dog").click()
      cy.get(interact.SPECTRUM_TEXTFIELD_INPUT)
        .first()
        .type("{{ trigger.row.name }}", { parseSpecialCharSequences: false })
      cy.get(interact.SPECTRUM_TEXTFIELD_INPUT)
        .eq(1)
        .type("11")
      cy.contains("Finish and test automation").click()

      cy.get(interact.MODAL_INNER_WRAPPER).within(() => {
        cy.get(interact.SPECTRUM_PICKER_LABEL, { timeout: 1000 }).click()
        cy.contains("dog").click()
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT, { timeout: 1000 })
          .first()
          .type("automationGoodboy")
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT)
          .eq(1)
          .type("11")
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT)
          .eq(2)
          .type("123456")
        cy.get(interact.SPECTRUM_TEXTFIELD_INPUT)
          .eq(3)
          .type("123456")
        cy.contains("Test").click()
      })
      cy.contains("Data").click()
      cy.contains("automationGoodboy")
    })
  })
})
