# last

```js
// usage
chance.last()
chance.last({ nationality: 'en' })
```

Generate a random last name

```js
Chance.last();
=> 'Mago'
```

Optionally specify a nationality to limit first names to those most common of that nationality

```js
Chance.last({ nationality: 'it' });
=> 'Giovannini'
```

Note, currently support for nationality is limited to: `'en', 'it', 'nl', 'uk', 'de', 'jp', 'es', 'fr'`.
