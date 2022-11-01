# url

```js
// usage
chance.url()
chance.url({protocol: 'ftp'})
chance.url({domain: 'www.socialradar.com'})
chance.url({domain_prefix: 'docs'})
chance.url({path: 'images'})
chance.url({extensions: ['gif', 'jpg', 'png']})
```

Return a random url.

```js
chance.url()
=> 'http://vanogsi.io/pateliivi'
```

Optionally specify a protocol and the url will be random but the protocol will not.

```js
chance.url({protocol: 'ftp'})
=> 'ftp://mibfu.nr/kardate'
```

Optionally specify a domain and the url will be random but the domain will not.

```js
chance.url({domain: 'www.socialradar.com'})
=> 'http://www.socialradar.com/hob'
```

Optionally specify a domain prefix and domain will be random, and domain prefix will not.

```js
chance.url({domain_prefix: 'docs'})
=> 'http://docs.tuos.ni/itecabup'
```

Optionally specify a path and it will be obeyed.

```js
chance.url({path: 'images'})
=> 'http://tainvoz.net/images'
```

Optionally specify an array of extensions and one will be picked at random.

```js
chance.url({extensions: ['gif', 'jpg', 'png']})
=> 'http://vagjiup.gov/udmopke.png'
```
