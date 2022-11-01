# string

```js
// usage
chance.string()
chance.string({ length: 5 })
chance.string({ min: 5 })
chance.string({ max: 50 })
chance.string({ min: 5, max: 20 })
chance.string({ pool: 'abcde' })
chance.string({ alpha: true })
chance.string({ casing: 'lower' })
chance.string({ symbols: true })
```

Return a random string.

```js
  chance.string();
  => 'Z&Q78&fqkPq'
```

By default it will return a string with random length of 5-20 characters and
will contain any of the following characters.

```js
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[]'
```

Can optionally specify a length and the string will be exactly that length.

```js
  chance.string({ length: 5 });
  => 'YN%fG'
```

Can optionally specify a min and the string will have a minimum lentgh

```js
  chance.string({ min: 5 });
  => '6(Ow1wF)qjUm%W)B2[Q]'
```

Can optionally specify a max and the string will have a maximum lentgh

```js
  chance.string({ max: 20 });
  => 'k7fubkfMS@gs#E'
```

Can optionally specify a pool and the string will be generated with characters
only from that pool.

```js
  chance.string({ pool: 'abcde' });
  => 'cccdeeabedebb'
```

Of course these options can also be combined, using length or min and max.

```js
  chance.string({ length: 5, pool: 'abcde' });
  => 'cbbdc'
```

```js
  chance.string({ min: 5, max: 20, pool: 'abcde' });
  => 'ebddceaaceeda'
```

All the options for [chance.character()](./character.md) are supported:

```js
  chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true });
  => '3THK7GB1'
```
