# street

```js
// usage
chance.street()
chance.street({country:it})
```

Generate a random street

```js
chance.street();
=> 'Tesca Circle'
```

Optionally mandate that it returns a short suffix

```js
chance.street({short_suffix: true});
=> 'Jiled St'
```

Optionally specify the number of syllables used to generate the street name

```js
chance.street({syllables: 8});
=> 'Teniefitinusewjircor Junction'
```

Optionally specify a country to localize street prefixes

```js
chance.street({country: 'it'});
=> 'Via Nefba'
```

Note, currently support for country is limited to: `'us', 'it'`.
