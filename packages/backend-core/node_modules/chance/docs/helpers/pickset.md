# pickset

```js
// usage
chance.pickset(array, quantity)
```

Given an array, pick some random elements and return them in a new array

```js
chance.pickset(['alpha', 'bravo', 'charlie', 'delta', 'echo'], 3);
=> ['echo', 'alpha', 'bravo']
```

Optionally omit the quantity to retrieve a set with length 1

```js
chance.pickset(['alpha', 'bravo', 'charlie', 'delta', 'echo']);
=> ['delta']
```
