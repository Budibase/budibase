# state

```js
// usage
chance.state()
chance.state({ full: true })
chance.state({ territories: true })
chance.state({ armed_forces: true })
chance.state({ us_states_and_dc: false })
chance.state({ country: 'us' })
```

Return a random state.

```js
chance.state();
=> 'AK'
```

By default, returns only the 2 letter abbreviation for state.

Optionally specify that it ought to return a full state name.

```js
chance.state({ full: true });
=> 'Florida'
```

Optionally add U.S. Territories ('American Samoa', 'Federated States of Micronesia', 'Guam', 'Marshall Islands', 'Northern Mariana Islands', 'Puerto Rico', 'Virgin Islands, U.S.') to the mix of randomly selected items:

```js
chance.state({ territories: true, full: true })
=> 'Guam'
```

Optionally add Armed Forces to the list as well:

```js
chance.state({ armed_forces: true, full: true })
=> 'Armed Forces Pacific'
```

For all U.S. states, territories, and armed forces, specify all of them:

```js
chance.state({ armed_forces: true, territories: true })
=> 'NY'
```

For just territories or armed forces, specify that it ought not return U.S. states:

```js
chance.state({ territories: true, us_states_and_dc: false })
=> 'PR'
```

Optionally specify a country (US specific options are ignored if country is specified and different from `'us'`):

```js
chance.state({ country: 'it', full: true })
=> 'Toscana'
```
