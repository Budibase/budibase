## Only allow `data-*` attribute selectors (require-data-selectors)
only allow `cy.get` to allow selectors that target `data-*` attributes

See [the Cypress Best Practices guide](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements).

> Note: If you use this rule, consider only using the `warn` error level, since using `data-*` attribute selectors may not always be possible.

### Rule Details

examples of **incorrect** code with `require-data-selectors`:
```js
cy.get(".a")
cy.get('[daedta-cy=submit]').click()
cy.get('[d-cy=submit]')
cy.get(".btn-large").click()
cy.get(".btn-.large").click()
```

examples of **correct** code with `require-data-selectors`:
```js
cy.get('[data-cy=submit]').click()
cy.get('[data-QA=submit]')
```
