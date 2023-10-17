## Do not use `cy.pause` command

It is recommended to remove [cy.pause](https://on.cypress.io/pause) command before committing the specs to avoid other developers getting unexpected results.

Invalid:

```js
cy.pause();
```

Valid:

```js
// only the parent cy.pause command is detected
cy.get('selector').pause();
```
