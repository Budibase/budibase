# cf

```js
// usage
chance.cf()
```
Generate a random Italian social security number (Codice Fiscale).

```js
chance.cf();
=> 'BRSMRT87S49A988X'
```

Optionally specify any or all components: first name, last name, gender, birth date, place of birth (using ISTAT geocodes for Italian cities).

```js
chance.cf({first: 'Sergio', last: 'Leone'});
=> 'LNESRG93P28F067V'

chance.cf({first: 'Sophia', last: 'Loren', gender: 'Female', birthday: new Date(1934,8,20), city: 'h501'});

=> 'LRNSPH34P60H501G'
```
