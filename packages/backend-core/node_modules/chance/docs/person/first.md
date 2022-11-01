# first

```js
// usage
chance.first()
chance.first({ nationality: 'us' })
```

Generate a random first name

```js
Chance.first();
=> 'Leila'
```

Optionally specify a gender to limit first names to that gender

```js
Chance.first({ gender: "female" });
=> 'Emma'
```

Optionally specify a nationality to limit first names to those most common of that nationality

```js
Chance.first({ nationality: "it" });
=> 'Alberto'
```

Note, currently support for nationality is limited to: `'us', 'it'`.

