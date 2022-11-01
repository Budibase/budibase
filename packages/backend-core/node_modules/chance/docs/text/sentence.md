# sentence

```js
// usage
chance.sentence()
chance.sentence({ words: 5 })
```

Return a random sentence populated by semi-pronounceable random (nonsense) words.

```js
  chance.sentence();
  => 'Witpevze mappos isoletu fo res bi geow pofin mu rupoho revzi utva ne.'
```

The sentence starts with a capital letter, and ends with a period.

Default is a sentence with a random number of words from 12 to 18.

*This length is chosen as the default as it works out to the average English
sentence is in that range.*

Optionally specify the number of words in the sentence.

```js
  chance.sentence({ words: 5 });
  => 'Waddik jeasmov cakgilta ficub up.'
```
