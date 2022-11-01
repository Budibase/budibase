# phone

```js
// usage
chance.phone()
chance.phone({ formatted: false })
chance.phone({ country: "fr" })
chance.phone({ country: "fr", mobile: true })
```

Generate a random phone

```js
chance.phone();
=> '(494) 927-2152'
```

By default conforms to [NANP](http://en.wikipedia.org/wiki/North_American_Numbering_Plan) for a proper US phone number.

Optionally disable formatting.

```js
chance.phone({ formatted: false });
=> '2617613391'
```

Optionally specify a country.

```js
chance.phone({ country: 'fr' });
=> '01 60 44 92 67'
```

Note, at current we only have support for `'us'`, `'uk'`, or `'fr'` for countries.

For `uk` and `fr`, optionally specify a mobile phone.

```js
chance.phone({ country: 'uk', mobile: true });
=> '07624 321221'
```
