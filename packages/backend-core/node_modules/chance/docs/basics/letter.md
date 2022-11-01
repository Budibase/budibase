# letter

```js
// usage
chance.letter()
chance.letter({ casing: 'lower' })
```

Return a random letter.

```js
chance.letter();
=> 'p'
```

By default it will return a random lowercase letter.

<p class="pullquote">Note, wanted to call this option just <strong>case</strong> instead of <strong>casing</strong> but unfortunately that's a reserved word in JavaScript for use in a switch statement</p>

It's possible to specify upper case

```js
chance.letter({casing: 'upper'});
=> 'A'
```
