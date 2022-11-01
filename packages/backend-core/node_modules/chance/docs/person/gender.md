# gender

```js
// usage
chance.gender()
```

Generate a random gender

```js
  Chance.gender();
  => 'Female'
```

Extra genders can be provided using the `extraGenders` key in the optional options argument:

```js
  Chance.gender({
    extraGenders: ['Agender', 'Genderqueer', 'Trans', 'Pangender']
  });
```
