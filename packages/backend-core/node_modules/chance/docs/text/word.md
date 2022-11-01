# word

```js
// usage
chance.word()
chance.word({ syllables: 3 })
chance.word({ length: 5 })
```

Return a semi-pronounceable random (nonsense) word.

```js
  chance.word();
  => 'bappada'
```

The word is returned in all lower case.

Default is a word with a random number of syllables from 1 to 3.

<p class="pullquote">This length is chosen as it works out to the average word length of ~5-6 chars
which seems about right.</p>

Can optionally specify a number of syllables which the word will have.

Note these are not syllables in the strict language definition of the word, but
syllables as we've defined here which is 2 or 3 characters, mostly alternating
between vowel and consanant. This is the about the best we can do with purely
random generation.

```js
  chance.word({ syllables: 3 });
  => 'tavnamgi'
```

Can optionally specify a length and the word will obey that bounding.

```js
  chance.word({ length: 5 });
  => 'ralve'
```

In this case these 2 options are mutually exclusive, that is they cannot be
combined as they often make no sense. It wouldn't be possible to have a word
with 7 syllables and a length of 5 or a length of 30 but 2 syllables.

Therefore, if both are specified, an Exception will be thrown so the Developer
can handle their broken case.

```js
  chance.word({ length: 5, syllables: 20 });
  => new RangeError("Chance: Cannot specify both syllables AND length.");
```

