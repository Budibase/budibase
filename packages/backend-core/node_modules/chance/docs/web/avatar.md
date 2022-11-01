# avatar

```js
// usage
chance.avatar()
chance.avatar({protocol: 'https'})
chance.avatar({fileExtension: 'jpg'})
chance.avatar({email: 'mail@victorquinn.com'})
```

Return a URL to a random avatar from Gravatar.

```js
chance.avatar()
=> '//www.gravatar.com/avatar/41f84bab4a852971eb1d26a287acb763'
```

By default, a url is returned without a protocol. Specify one to get a random
url but with a known protocol

```js
chance.avatar({protocol: 'https'})
=> 'https://www.gravatar.com/avatar/f40260c4058cc904b7db652c26099966'
```

Optionally specify a file extension to get one of a known type

```js
chance.avatar({fileExtension: 'jpg'})
=> '//www.gravatar.com/avatar/76697df5874c854e3cc8fde1200b4298.jpg'
```

You can also use it with a known email address to just get that gravatar.

However, note this, of course, no longer makes it random, just more of a helper
function:

```js
chance.avatar({email: 'mail@victorquinn.com'})
=> 'www.gravatar.com/avatar/8595c2591b0bca22e736813af33fa7c3'
```

