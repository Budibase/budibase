# domain

```js
// usage
chance.domain()
chance.domain({tld: 'com'})
```

Return a random domain with a random [tld](#tld).

```js
chance.domain()
=> 'onaro.net'
```

Optionally specify a tld and the domain will be random but the tld will not.

```js
chance.domain({tld: 'ie'})
=> 'gotaujo.ie'
```

