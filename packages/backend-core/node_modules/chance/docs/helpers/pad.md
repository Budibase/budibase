# pad

```js
// usage
chance.pad(number, width)
chance.pad(number, width, padder)
```

Pad a number with some string until it reaches a desired width.

By default, `chance.pad()` will pad with zeroes. For example, to zero-pad
numbers such that the outcome width is 5, do the following.

```js
chance.pad(45, 5)
=> '00045'

chance.pad(284, 5)
=> '00284'

chance.pad(82843, 5)
=> '82843'
```

Notice how every item returned is a string with leading zeroes until the width
is 5 for each one.

Can optionally specify a character if the desire is to pad with something other
than zero.

```js
chance.pad(81, 5, 'Z')
=> 'ZZZ81'

chance.pad(692, 5, 'Z')
=> 'ZZ692'

chance.pad(52859, 5)
=> '52859'
```
