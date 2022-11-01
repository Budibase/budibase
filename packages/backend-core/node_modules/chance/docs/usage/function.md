# function

Instead of providing a seed, which will be used to seed our [Mersenne Twister](https://en.wikipedia.org/wiki/Mersenne_twister),
you can also specify an arbitrary function to generate random numbers which the
rest of the library will utilize when generating everything else.

A rather simple example, simply using Math.random() instead of our Mersenne Twister

```js
// Use Math.random() instead of our Mersenne Twister
var chance = new Chance(Math.random);

chance.address()
=> '131 Asmun Pike'
chance.address() 
=> '261 Pawnaf Highway'
```

Chance will appear to work just the same, but have a different underlying random
generator.

This function should return any number between 0 and 1.
