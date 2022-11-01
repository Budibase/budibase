# note

```js
// usage
chance.note();
chance.note({ notes: 'flatkey' });
```

Return a note. 🎵

```js
chance.note();
=> 'B'

chance.note();
=> 'E♭'
```

Options
flatKey - chromatic scale with flat notes (default)
sharpKey - chromatic scale with sharp notes
flats - just flat notes
sharps - just sharp notes
naturals - just natural notes
all - naturals, sharps and flats

```js
chance.note({notes: 'flats' });
=> 'A'

chance.note({notes: 'sharps' });
=> 'F♯'
```
