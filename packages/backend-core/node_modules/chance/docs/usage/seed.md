# seed

You can also instantiate your own instance of Chance with a known seed. This is
useful for creating repeatable results.

```js
var chance1 = new Chance(12345);
var chance2 = new Chance(12345);

// These yield the same values, in sequence
console.log(chance1.random());
console.log(chance2.random());
```

Since both copies of Chance had the same seed, they will both generate the same
random number sequence each time they're called.

This allows for repeatability, if desired.

This is possible because **Chance** is built atop a [Mersenne Twister][mersenne],
a pseudo-random number generator which produces repeatable results given the same seed.

Optionally provide the seed as a string.

```js
var chance1 = new Chance("foo");
var chance2 = new Chance("bar");

// These will be different
console.log(chance1.random());
console.log(chance2.random());
```

Optionally provide multiple arguments as the seed.

```js
var chance1 = new Chance("hold", "me", "closer");
var chance2 = new Chance("tony", "danza");
var chance3 = new Chance("hold", "me", "closer");

// These will be different
console.log(chance1.random());
console.log(chance2.random());

// This will be the same as the value from chance1 above
console.log(chance3.random());
```

[mersenne]: http://en.wikipedia.org/wiki/Mersenne_twister
