# tempo

```js
// usage
chance.tempo(); //default between 40 to 320
chance.tempo({ min: 60, max: 120 });
```

Return a tempo. 🎵

```js
chance.tempo();
=> 58

chance.tempo();
=> 281

chance.tempo({ max: 80 });
=> 45

chance.tempo({ min: 120 });
=> 172

```