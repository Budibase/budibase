# age

```js
// usage
chance.age()
chance.age({ type: 'child' })
```

Generate a random age

```js
chance.age();
=> 45
```

Default range is between 1 and 120

Optionally specify one of a handful of enumerated age types:

```js
chance.age({type: 'child'});
=> 9
```

Allowed types are: `child`, `teen`, `adult`, `senior`
