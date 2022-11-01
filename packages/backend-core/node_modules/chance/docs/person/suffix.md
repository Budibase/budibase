# suffix

```js
// usage
chance.suffix()
chance.suffix({ full: true })
```

Generate a random name suffix

```js
chance.suffix();
=> 'Sr.'
```

By default, returns the shorter version.

Optionally get back the full version.

```js
chance.suffix({ full: true });
=> 'Juris Doctor'
```

*To maintain legacy support, this also responds to chance.name_suffix().*
