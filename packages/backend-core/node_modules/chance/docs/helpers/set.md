# set

```js
// usage
chance.set(key, value)
```

Used for overriding the default data used by Chance.

For example, if instead of the default set of last names (which were pulled from the U.S. census data and therefore obviously American biased), you could replace the data for the first names with something more suited to your task. For example, if you want instead to pick from last names of houses in *A Song of Ice and Fire*, you could do something like:

```js
chance.set('lastNames', ['Arryn', 'Baratheon', 'Bolton', 'Frey', 'Greyjoy', 'Lannister', 'Martell', 'Stark', 'Targaryen', 'Tully', 'Tyrell']);

// then
chance.last()
=> 'Lannister'
```

This is very handy for internationalization.

Available keys for datasets to override: `firstNames`, `lastNames`, `provinces`, `us_states_and_dc`, `territories`, `armed_forces`, `street_suffixes`, `months`, `cc_types`, `currency_types`

