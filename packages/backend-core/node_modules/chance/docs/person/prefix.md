# prefix

```js
// usage
chance.prefix()
chance.prefix({ full: true })
```

Generate a random name prefix

```js
chance.prefix();
=> 'Mrs.'
```

By default, returns the shorter version.

Optionally get back the full version.

```js
chance.prefix({ full: true });
=> 'Mister'
```

Optionally specify a gender. Valid options are `male`, `female`, or `all` (the default).

```js
chance.prefix({ gender: "male" });
=> 'Mr.'

chance.prefix({ gender: "female" });
=> 'Miss'
```

*To maintain legacy support, this also responds to chance.name_prefix().*
