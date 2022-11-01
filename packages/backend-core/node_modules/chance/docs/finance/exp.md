# exp

```js
// usage
chance.exp()
chance.exp({raw: true})
```

Generate a random credit card expiration.

```js
chance.exp();
=> '10/2020'
```

Optionally specify that a raw object be returned rather than a string

```js
chance.exp({raw: true});
=> {month: '11', year: '2017'}
```
