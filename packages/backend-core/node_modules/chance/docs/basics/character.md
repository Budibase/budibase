# character

```js
// usages
chance.character()
chance.character({ pool: 'abcde' })
chance.character({ alpha: true })
chance.character({ numeric: true })
chance.character({ casing: 'lower' })
chance.character({ symbols: true })
```

Return a random character.

```js
chance.character();
=> 'v'
```

By default it will return a string with random character from the following
pool.

```js
'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'
```

Optionally specify a pool and the character will be generated with characters
only from that pool.

```js
chance.character({ pool: 'abcde' });
=> 'c'
```

Optionally specify alpha for an alphabetic character.

```js
chance.character({ alpha: true });
=> 'N'
```

Optionally specify numeric for a numeric character.

```js
chance.character({ numeric: true });
=> '8'
```

Default includes both upper and lower case. It's possible to specify one or the
other.

```js
chance.character({ casing: 'lower' });
=> 'j'
```

*Note, wanted to call this key just ```case``` but unfortunately that's a
reserved word in JavaScript for use in a switch statement*

Optionally return only symbols

```js
chance.character({ symbols: true });
=> '%'
```
