# ssn

```js
// usage
chance.ssn()
chance.ssn({ ssnFour: true })
chance.ssn({ dashes: false })
```

Generate a random social security number.

```js
chance.ssn();
=> '411-90-0070'
```

Optionally provide option of getting only the last four

```js
chance.ssn({ ssnFour: true });
=> '2938'
```

Optionally specify dashes be removed

```js
chance.ssn({ dashes: false });
=> '293839295'
```
