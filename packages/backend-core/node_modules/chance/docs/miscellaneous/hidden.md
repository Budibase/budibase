# hidden

```js
// usage
chance.cc_types()
chance.mersenne_twister()
chance.mersenne_twister(12345)
chance.months()
chance.name_prefixes()
chance.provinces()
chance.states()
chance.street_suffix()
chance.street_suffixes()
```

These aren't really hidden per se, but just utility methods intended to be used
internally but exposed externally in case they're useful to anyone.

```js

// Return the list of cc types
chance.cc_types()
=> [{name: "American Express", short_name: 'amex', prefix: '34', length: 15}, ...]

// Return a new Mersenne Twister
chance.mersenne_twister()
=> [object Object] // An instance of a Mersenne Twister

// Optionally provide a seed for that twister
chance.mersenne_twister(12345)
=> [object Object] // An instance of a twister with seed 12345

// Return our list of name prefixes
chance.months();
=> [{name: 'January', short_name 'Jan', numeric: '01'}, ...]

// Return our list of name prefixes
chance.name_prefixes();
=> [{name: 'Doctor', abbreviation: 'Dr.'}, {name: 'Miss', abbreviation: 'Miss'}, ...]

// Return the list of provinces
chance.provinces();
=> [{name: 'Alberta', abbreviation: 'AB'}, {name: 'British Columbia', abbreviation: 'BC'}, ...]

// Return the list of states
chance.states();
=> [{name: 'Alabama', abbreviation: 'AL'}, {name: 'Alaska', abbreviation: 'AK'}, ...]

// Return a random street suffix
chance.street_suffix();
=> {name: 'Street', abbreviation: 'St'}

// Return the list of street suffixes
chance.street_suffixes();
=> [{name: 'Avenue', abbreviation: 'Ave'}, {name: 'Boulevard', abbreviation: 'Blvd'}, ...]

```


