# aadhar

_Aadhar_ (English: Foundation) is a 12-digit unique identity number that can be obtained by residents of India, based on their biometric and demographic data.

```js
// usage
chance.aadhar()
chance.aadhar({ onlyLastFour: true }) // false by default
chance.aadhar({ separatedByWhiteSpace: false }) // true by default
```

Generate a random aadhar.

```js
chance.aadhar();
=> '8506 7820 9696'
```

Optionally provide option of getting only the last four

```js
chance.aadhar({ onlyLastFour: true });
=> '1851'
```

Optionally specify dashes be removed

```js
chance.aadhar({ separatedByWhiteSpace: false });
'873300307032'
```
