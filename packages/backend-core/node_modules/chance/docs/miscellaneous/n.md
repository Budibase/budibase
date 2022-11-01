# n

```js
// usage
chance.n(chance.email, 5)
chance.n(chance.email, 5, { domain: "socialradar.com" })
```

Provide any function that generates random stuff (usually another **Chance** function) and a number and `n()` will generate an array of items with a length matching the length you specified.

For example, to generate 5 email addresses:

```js
chance.n(chance.email, 5);
=> [ 'nese@me.gov',
'tukvogi@novew.co.uk',
'worzi@jotok.edu',
'wicumafom@lalu.edu',
'hifebwo@abecusa.com' ]
```

Any options that would be sent to the random function can be added following the number.

For example, `chance.email()` has options which can be specified, so you can generate 5 emails with a known domain as follows:

```js
chance.n(chance.email, 5, { domain: "socialradar.com" })
=> [ 'nuvvu@socialradar.com',
'icolul@socialradar.com',
'rig@socialradar.com',
'ca@socialradar.com',
'uc@socialradar.com' ]
```

Note, these items are not guaranteed to be unique. If that is the intent, see [`chance.unique()`](http://chancejs.com/#unique)
