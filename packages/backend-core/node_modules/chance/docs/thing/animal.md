# animal

```js
// usage
chance.animal()
chance.animal({type: 'zoo'})
```

Generate a random animal

```js
chance.animal();
=> 'Cobra'
```

Default is any type of animal.

Optionally specify a specific type of animal

```js
chance.animal({type: 'zoo'});
=> 'Lion'
```

Allowed types are: `ocean`, `desert`, `grassland`, `forest`, `farm`, `pet`, and `zoo`
