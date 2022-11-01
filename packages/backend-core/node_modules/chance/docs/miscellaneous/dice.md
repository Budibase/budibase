# dice

```js
// usage
chance.d4()
chance.d6()
chance.d8()
chance.d10()
chance.d12()
chance.d20()
chance.d30()
chance.d100()
```

<p class="pullquote" data-pullquote='"Any dungeon master worth his weight in geldings goes nowhere without his 20 sided die."' markdown="1"></p>

Return a value equal to the roll of a die.

```js
chance.d20();
=> 13

chance.d6();
=> 4
```

These are just wrappers around natural() but are convenient for use by games.

They return values between 1 and the number after the `d`, so `chance.d4()` returns 1, 2, 3, or 4, just like a 4 sided die would.
