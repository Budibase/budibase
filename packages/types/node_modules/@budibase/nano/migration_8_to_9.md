# Migration Guide for moving from Nano 8.x to 9.x

The 9.x release of Nano sees the following changes:

- the underlying library that handles HTTP request changes to [axios](https://www.npmjs.com/package/axios) as the previous library has been deprecated.
- the number of dependencies has been reduced - there are now only two runtime dependencies.
- the changes feed handler has been rewritten and bundled as part of Nano. See "changesReader".
- reworked custom logging.

Most Nano users will be able to switch from Nano 8.x to Nano 9.x without modifying any code but as this is a major version release, some things have changed which _may_ break your code - pay particular attention if you were using the "Follow" library or had configured custom logging.

## Following the changes feed

The changes feed reader is completely rewritten and has a new interface:

```js
const db = nano.db.use('mydb')
db.changesReader.start({ batchSize: 50 })
  .on('batch', (b) => {
    console.log('a batch of', b.length, 'changes has arrived');
  }).on('seq', (s) => {
    console.log('sequence token', s);
  }).on('error', (e) => {
    console.error('error', e);
  })
```

## Logging

```js
const url = require('url')
const logger = (data) => {
  // if this is a request
  if (typeof data.err === 'undefined') {
    const u = new url.URL(data.uri)
    console.log(data.method, u.pathname, data.qs)
  } else {
    // this is a response
    const prefix = data.err ? 'ERR' : 'OK'
    console.log(prefix, data.headers.statusCode, JSON.stringify(data.body).length)
  }
}
const nano = Nano({ url: process.env.COUCH_URL, log: logger })