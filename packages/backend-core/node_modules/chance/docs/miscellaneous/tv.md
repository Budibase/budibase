# tv

```js
// usage
chance.tv()
chance.tv({side: 'west'})
```

Generate a TV station call sign. This is an alias for `radio()` since they both
follow the same rules.

```js
chance.radio();
=> 'WXTY'
```

Optionally specify a side of the Mississippi River to limit stations to that side.

```js
chance.radio({side: 'west'});
=> 'KCYL'

chance.radio({side: 'west'});
=> 'KQDV'
```
