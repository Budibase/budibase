Pouch Stream
====

Streaming plugin for PouchDB

```bash
npm install pouch-stream
```

```js
PouchDB.plugin(require('pouch-stream'));
```

Writable
---

note: the docs you give it can have _ids's or not and it will do post or put depending, you can also pass an array for bulk docs, it also takes an option object which will be passed verbatem to bulkDocs, put, or post.

```js
var stream = db.createWriteStream();
stream.write({
  foo: 'bar',
  _id: 'testDoc'
}, function () {
  // chunk is flushed
});
```

but wait there is more, the database itself is a write streem though you can't close it, you can do


```js
var random = require("random-document-stream");
random(100).pipe(db);
```

Readable
---

```js
var db = new PouchDB('foo');
var stream = db.createReadStream();
stream.on('data', function (d) {
  // deal with data
});
```

you can also set `since` 

var stream = db.createReadStream({since:19});
stream.on('data', function (d) {
  // deal with data after seq 19
});
