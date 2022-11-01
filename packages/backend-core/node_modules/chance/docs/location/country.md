# country

```js
// usage
chance.country()
chance.country({ full: true })
```

Return a random country.

```js
chance.country();
=> 'LT'
```

By default, returns only the 2 letter ISO 3166-1 code for the country.

Optionally specify that it ought to return a full country name.

```js
chance.country({ full: true });
=> 'Venezuela'
```
