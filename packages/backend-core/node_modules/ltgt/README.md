# ltgt

implement correct ranges for level-*

[![build status](https://secure.travis-ci.org/dominictarr/ltgt.png)](http://travis-ci.org/dominictarr/ltgt)
[![testling badge](https://ci.testling.com/dominictarr/ltgt.png)](https://ci.testling.com/dominictarr/ltgt)

# example


``` js
var ltgt = require('ltgt')

ltgt.start(range) //the start of the range
ltgt.end(range)   //the end of the range

//returns the lower/upper bound, whether it's inclusive or not.
ltgt.lowerBound(range)
ltgt.upperBound(range)

ltgt.lt(range)
ltgt.gt(range)
ltgt.lte(range)
ltgt.gte(range)

//return wether this is a reversed order
//(this is significant for start/end ranges
ltgt.reverse(range)
var filter = ltgt.filter(range)

filter(key) == true //if key contained in range.

ltgt.contains(range, key)

```

# ways to specify ranges

there have been a variety of ways to specify ranges in level-*.
this module supports them all.

# gt/gte, lt/lte

specify a range between a lower bound (gt, gte) and an upper bound (lt, lte)

if `gte` and `gt` is undefined, read from the start of the database,
if `lte` and `lt` is undefined, read until the end of the database,


# min, max

legacy level-sublevel style,
synonym for `gte`, `lte`.

# start, end, reverse

legacy levelup style.

The range is from `start` -> `end`, `start` does not specify the lowest
record, instead it specifies the first record to be read. However,
`reverse` must also be passed correctly. This is way to specify a range is
confusing if you need to read in reverse,
so it's strongly recommended to use `gt/gte,lt/lte`.

If `reverse` is `true`,
`start` *must* be `undefined` or less than `end`,
unless `end` is `undefined`.

if `reverse` is `false`
`end` *must* be `undefined` or greater than `start`,
unless `start` is `undefined`.

if start is undefined, read from the first record in the database
if end is undefined read until the last record in the database.

# api

## ltgt.contains(range, key, compare)

using the provided compare method, return `true` if `key`
is within `range`. compare defaults to `ltgt.compare`

## ltgt.filter(range, compare)

return a function that returns true if it's argument is within range.
can be passed to `Array.filter`

``` js
[1,2,3,4,5].filter(ltgt.filter({gt: 2, lte: 4})
// => [3, 4]
```

## ltgt.lowerBound(range)

return the lower bound of `range`.
Incase the lower bound is specified with `gt`,
check `ltgt.lowerBoundExclusive`

## ltgt.upperBound(range)

return the upperBound of `range`.
Incase the upper bound is specified with `gt`,
check `ltgt.upperBoundExclusive`

## ltgt.lowerBoundExclusive(range)

return true if upper bound is exclusive.

## ltgt.upperBoundExclusive(range)

return true if lower bound is exclusive.

## ltgt.start(range, default)

The start of the range. This takes into account direction (reverse)
If a `start` is not provided, `default` is used.

## ltgt.end(range, default)

The end of the range. This takes into account direction (reverse)
If a `end` is not provided, `default` is used.

## ltgt.startInclusive(range)

returns true if the range should start at the exact value returned
by `start(range)` otherwise, it should skip one input.

## ltgt.endInclusive(range)

returns true if the range should include the exact value returned
by `end(range)` otherwise, it should end on that value.

## ltgt.toLtgt(range, _range, map, lowerBound, upperBound)

convert a range to a new ltgt range. `_range`
is the object to return - if you want to mutate `range`
call `ltgt.toLtgt(range, range, map)`

`map` gets called on each key in the range, and wether it's an upper or lower bound -
so can be used as an encode function.

`map(value, isUpperBound)` if `isUpperBound` is false, this is the lower bound.

## License

MIT




