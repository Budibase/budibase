# date

```js
// usage
chance.date()
chance.date({string: true})
chance.date({string: true, american: false})
chance.date({year: 1983})
```

Generate a random date

```js
chance.date();
=> Sat Apr 09 2072 00:00:00 GMT-0400 (EDT)
```

By default, returns an actual [Date][Date] object

Can optionally specify that a date be returned as a string

```js
chance.date({string: true});
=> "5/27/2078"
```

This will return a date string of the format MM/DD/YYYY.

Now of course MM/DD/YYYY is the "American" date method, but it's the default
because there isn't much support for internationalization here yet. Further,
it's the format used by [Facebook][FB] and other services for birthdays and
other non-Date object dates.

However, we support returning dates in DD/MM/YYYY format as well when requesting
a date by a string and passing `american: false`.

```js
chance.date({string: true, american: false});
=> "13/2/2017"
```

If you want richer control over date format, strongly suggest using the
[Moment][Moment] library. Our formatting is very minimalist, and it's out of our
core competency to offer dates in a myriad of formats.

Can optionally specify defaults for any of day, month, or year.

```js
chance.date({year: 1983});
=> Wed May 04 1983 00:00:00 GMT-0400 (EDT)

chance.date({month: 0});
=> Tue Jan 18 2084 00:00:00 GMT-0500 (EST)

chance.date({day: 21});
=> Sun Oct 21 2103 00:00:00 GMT-0400 (EDT)
```

A random date is generated, but the default you specify is kept constant.

Note, month is 0-indexed. This is a carryover from the core JavaScript
[Date][Date] object which we use internally to generate the date. We
considered

[Date]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
[FB]: https://developers.facebook.com/docs/reference/api/user/
[Moment]: http://momentjs.com
