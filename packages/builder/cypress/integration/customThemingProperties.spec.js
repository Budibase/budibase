context("Custom Theming Properties", () => {
    before(() => {
      cy.login()
      cy.createTestApp()
      cy.navigateToFrontend()
    })

    // Default Values
    // Button roundness = Large
    // Primary colour = Blue 600
    // Primary colour (hover) = Blue 500
    // Navigation bar background colour = Gray 100
    // Navigation bar text colour = Gray 800
    it("should reset the color property values", () => {
      // Open Theme modal and change colours  
      cy.get(".spectrum-ActionButton-label").contains("Theme").click()
        cy.get(".spectrum-Picker").contains("Large").click()
        .parents()
        .get(".spectrum-Menu-itemLabel").contains("None").click()
        changeThemeColors()
        // Reset colours
        cy.get(".spectrum-Button-label").contains("Reset").click({force: true})
        // Check values have reset
        checkThemeColorDefaults()
    })
    
    const changeThemeColors = () => {
      // Changes the theme colours
      cy.get(".spectrum-FieldLabel").contains("Primary color")
        .parent().find(".container.svelte-z3cm5a").click()
        .find('[title="Red 400"]').click()
        cy.get(".spectrum-FieldLabel").contains("Primary color (hover)")
        .parent().find(".container.svelte-z3cm5a").click()
        .find('[title="Orange 400"]').click()
        cy.get(".spectrum-FieldLabel").contains("Navigation bar background color")
        .parent().find(".container.svelte-z3cm5a").click()
        .find('[title="Yellow 400"]').click()
        cy.get(".spectrum-FieldLabel").contains("Navigation bar text color")
        .parent().find(".container.svelte-z3cm5a").click()
        .find('[title="Green 400"]').click()
    }
    
    const checkThemeColorDefaults = () => {
      cy.get(".spectrum-FieldLabel").contains("Primary color")
        .parent().find(".container.svelte-z3cm5a").click()
        .get('[title="Blue 600"]').children().find('[aria-label="Checkmark"]')
        cy.get(".spectrum-Dialog-grid").click()
        cy.get(".spectrum-FieldLabel").contains("Primary color (hover)")
        .parent().find(".container.svelte-z3cm5a").click()
        .get('[title="Blue 500"]').children().find('[aria-label="Checkmark"]')
        cy.get(".spectrum-Dialog-grid").click()
        cy.get(".spectrum-FieldLabel").contains("Navigation bar background color")
        .parent().find(".container.svelte-z3cm5a").click()
        .get('[title="Gray 100"]').children().find('[aria-label="Checkmark"]')
        cy.get(".spectrum-Dialog-grid").click()
        cy.get(".spectrum-FieldLabel").contains("Navigation bar text color")
        .parent().find(".container.svelte-z3cm5a").click()
        .get('[title="Gray 800"]').children().find('[aria-label="Checkmark"]')
    }

})