# rpg

```js
// usage
chance.rpg('#d#')
chance.rpg('#d#', {sum: true})
```

Given an input looking like #d#, where the first # is the number of dice to
roll and the second # is the max of each die, returns an array of dice values.

```js
chance.rpg('3d10');
=> [1, 6, 9]

chance.rpg('5d6');
=> [3, 1, 2, 5, 2]
```

Optionally specify a sum be returned rather than an array of dice.

```js
chance.rpg('3d10', {sum: true});
=> 14
```
