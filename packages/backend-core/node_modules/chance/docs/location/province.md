# province

```js
// usage
chance.province()
chance.province({full: true})
chance.province({full: true})
```

Return a random province.

```js
chance.province();
=> 'ON'
```

By default, returns only the 2 letter abbreviation for province.

Optionally specify that it ought to return a full province name.

```js
chance.province({full: true});
=> 'Nova Scotia'
```

Optionally specify the country from which it should return the province name.

```js
chance.province({country: 'it', full: true});
=> 'Vicenza'
```

Note, currently support for country is limited to: `'ca', 'it'`.
