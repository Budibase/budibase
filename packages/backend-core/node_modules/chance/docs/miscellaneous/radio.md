# radio

```js
// usage
chance.radio()
```

<p class="pullquote" data-pullquote='Broadcast call signs start with a W if east of the Mississippi River and K if west.' markdown="1"></p>

Generate a random radio call sign.

```js
chance.radio();
=> 'KCXW'
```

Optionally specify a side of the Mississippi River to limit stations to that side.

See [K and W](http://en.wikipedia.org/wiki/Call_signs_in_North_America#K_and_W) for more details

```js
chance.radio({side: 'east'});
=> 'WKOQ'

chance.radio({side: 'east'});
=> 'WNOW'
```
