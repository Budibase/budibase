# exp_month

```js
// usage
chance.exp_month()
chance.exp_month({future: true})
```

Generate a random credit card expiration month.

```js
chance.exp_month();
=> '01'
```

Optionally specify that it must be a later month than the current month.

```js
chance.exp_month({future: true});
=> '10'
```

So if called in June, this would return a random month from July - Dec. If
called in October, would return November or December.

This because many credit card sandboxes require an expiration date later
than the current date so it's necessary when generating an expiration with the
current year to generate a month later than the current month.
