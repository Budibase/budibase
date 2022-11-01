# hash

```js
// usage
chance.hash()
chance.hash({length: 25})
chance.hash({casing: 'upper'})
```

Return a random hex hash

```js
chance.hash()
=> 'e5162f27da96ed8e1ae51def1ba643b91d2581d8'
```

By default, the hash is lowercase and 40 hex characters long (same as a git
commit hash).

Optionally specify a length

```js
chance.hash({length: 15})
=> 'c28f57cb599ada4'
```

Optionally specify casing to get a hash with only uppercase letters
rather than the default lowercase

```js
chance.hash({casing: 'upper'})
=> '3F2EB3FB85D88984C1EC4F46A3DBE740B5E0E56E'
```


