# zip

```js
// usage
chance.zip()
chance.zip({plusfour: true})
```

Generate a random (U.S.) zip code.

```js
chance.zip();
=> '90210'
```

Can optionally specify that it ought to return a [Zip+4][zip+4]:

```js
chance.zip({plusfour: true});
=> '01035-1838'
```

[zip+4]: http://vq.io/19rzsve
