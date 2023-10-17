# disallow using of 'force: true' option (no-force)

Using `force: true` on inputs appears to be confusing rather than helpful.
It usually silences the actual problem instead of providing a way to overcome it.
See [Cypress Core Concepts](https://docs.cypress.io/guides/core-concepts/interacting-with-elements.html#Forcing).

If enabling this rule, it's recommended to set the severity to `warn`.

## Rule Details

This rule aims to disallow using of the `force` option on:[`.click()`](https://on.cypress.io/click),
[`.dblclick()`](https://on.cypress.io/dblclick), [`.type()`](https://on.cypress.io/type),
[`.rightclick()`](https://on.cypress.io/rightclick), [`.select()`](https://on.cypress.io/select),
[`.focus()`](https://on.cypress.io/focus), [`.check()`](https://on.cypress.io/check),
and [`.trigger()`](https://on.cypress.io/trigger).
Examples of **incorrect** code for this rule:

```js

cy.get('button').click({force: true})
cy.get('button').dblclick({force: true})
cy.get('input').type('somth', {force: true})
cy.get('div').find('.foo').find('.bar').trigger('change', {force: true})
cy.get('input').trigger('click', {force: true})
cy.get('input').rightclick({force: true})
cy.get('input').check({force: true})
cy.get('input').select({force: true})
cy.get('input').focus({force: true})

```

Examples of **correct** code for this rule:

```js

cy.get('button').click()
cy.get('button').click({multiple: true})
cy.get('button').dblclick()
cy.get('input').type('somth')
cy.get('input').trigger('click', {anyoption: true})
cy.get('input').rightclick({anyoption: true})
cy.get('input').check()
cy.get('input').select()
cy.get('input').focus()

```


## When Not To Use It

If you don't mind using `{ force: true }` with action commands, then turn this rule off.
