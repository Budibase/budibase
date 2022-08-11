PouchDB Replication Stream
=====

[![Build Status](https://travis-ci.org/nolanlawson/pouchdb-replication-stream.svg)](https://travis-ci.org/nolanlawson/pouchdb-replication-stream)

`ReadableStream`s and `WritableStream`s for PouchDB/CouchDB replication.

Basically, you can replicate two databases by just attaching the streams together.

This has many uses:

1. Dump a database to a file, and then load that same file into another database.
2. Do a quick initial replication by dumping the contents of a CouchDB to an HTTP endpoint, which is then loaded into a PouchDB in the browser.
3. Replicate over web sockets? Over bluetooth? Over NFC? Why not? Since the replication stream is just JSON plaintext, you can send it over any transport mechanism.
4. Periodically backup your database.

Suite of Tools
---------

* [pouchdb-dump-cli](https://github.com/nolanlawson/pouchdb-dump-cli)
* [pouchdb-load](https://github.com/nolanlawson/pouchdb-load)
* [express-pouchdb-replication-stream](https://github.com/conor-mac-aoidh/express-pouchdb-replication-stream)

Examples
------

You can use `pouchdb-replication-stream` itself to:
  * [dump to a string](#dumping-to-a-string)
  * [replicate with in-memory streams](https://github.com/nolanlawson/pouchdb-replication-stream#stream-directly-without-the-dump-file)
  * do anything you can do with streams :)

Usage
-------

Let's assume you have two databases. It doesn't matter whether they're remote or local:

```js
var db1 = new PouchDB('mydb');
var db2 = new PouchDB('http://localhost:5984/mydb');
```

Let's dump the entire contents of db1 to a file using `dump()`:

```js
var ws = fs.createWriteStream('output.txt');

db1.dump(ws).then(function (res) {
  // res should be {ok: true}
});
```

Now let's read that file into another database using `load()`:

```js
var rs = fs.createReadStream('output.txt');

db2.load(rs).then(function (res) {
  // res should be {ok: true}
});
```

Congratulations, your databases are now in sync. It's the same effect as if you had done:

```js
db1.replicate.to(db2);
```

API
-----

### db.dump(stream [, opts])

Dump the `db` to a `stream` with the given `opts`. Returns a Promise.

The `opts` are passed directly to the `replicate()` API [as described here](http://pouchdb.com/api.html#replication). In particular you may want to set:

* `batch_size` - how many documents to dump in each output chunk. Defaults to 50.
* `since` - the `seq` from which to start reading changes.

The options you are allowed to pass through are: `batch_size`, `batches_limit`, `filter`, `doc_ids`, `query_params`, `since`, and `view`.

### db.load(stream)

Load changes from the given `stream` into the `db`. Returns a Promise.

This is an idempotent operation, so you can call it multiple times and it won't change the result.

#### Warning when using `pouchdb-load`

The [pouchdb-load](https://github.com/nolanlawson/pouchdb-load) plugin has its own `db.load()`
function, which is incompatible with this one. If you want to use both plugins at the same
time, then you will need to do:

```js
var PouchDB = require('pouchdb');
var load = require('pouchdb-load');
PouchDB.plugin({
  loadIt: load.load
});
// Then load `pouchdb-replication-stream` normally
```

Then you can use `pouchdb-load` via `db.loadIt()`, which will not clobber the `db.load()` from  this plugin. (You must use Browserify/Webpack, since there is no prebuilt `loadIt()` version.)

Design
----

The replication stream looks like this:

```js
{"version":"0.1.0","db_type":"leveldb","start_time":"2014-09-07T21:31:01.527Z","db_info":{"doc_count":3,"update_seq":3,"db_name":"testdb"}}
{"docs":[{"_id":"doc1","_rev":"1-x","_revisions":{"start":1,"ids":["x"]},"foo":"bar"}]}
{"docs":[{"_id":"doc2","_rev":"1-y","_revisions":{"start":1,"ids":["y"]},"foo":"baz"}]}
{"docs":[{"_id":"doc3","_rev":"1-z","_revisions":{"start":1,"ids":["z"]},"foo":"quux"}]}
{"seq":3}
```

I.e. it's just NDJ - Newline Delimited JSON. Each line is a list of the documents to be loaded into the target database (using `bulkDocs()` with `{new_edits: false}`).

The first line is a header containing some basic info, like the number of documents in the database and the replication stream protocol version. Such info many be useful for showing a progress bar during the `load()` process, or for handling later versions, in case this protocol changes.

This replication stream is _idempotent_, meaning you can load it into a target database any number of times, and it will be as if you had only done it once.

At the end of the `load()` process, the target database will function exactly as if it had been replicated from the source database. Revision hashes, conflicts, attachments, and document contents are all faithfully transported.

Some lines may contain `seq`s; these are used as checkpoints. The `seq` line says, "When you have loaded all the preceding documents, you are now at update_seq `seq`."

For the time being, attachments are just included as base64-encoded strings, ala CouchDB's `_all_docs` with `attachments=true` and `Accept: application/json`.

Installation
--------

To use this plugin, download it from the `dist` folder and include it after `pouchdb.js` in your HTML page:

```html
<script src="pouchdb.js"></script>
<script src="pouchdb.replication-stream.js"></script>
```

You can also use Bower:

    bower install pouchdb-replication-stream

Or to use it in Node.js, just npm install it:

    npm install pouchdb-replication-stream

In Node.js, you can attach it to the `PouchDB` object using the following code:

```js
var PouchDB = require('pouchdb');
var replicationStream = require('pouchdb-replication-stream');

PouchDB.plugin(replicationStream.plugin);
PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);
```

Stream directly without the dump file
---

On Node.js or with [`Browserify`](http://browserify.org/), ou can use a [`MemoryStream`](https://github.com/JSBizon/node-memorystream) to stream directly without dumping to a file. Here's an example:

```js
var Promise = require('bluebird');
var PouchDB = require('pouchdb');
var replicationStream = require('pouchdb-replication-stream');
var MemoryStream = require('memorystream');

PouchDB.plugin(replicationStream.plugin);
PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);
var stream = new MemoryStream();

var source = new PouchDB('http://localhost:5984/source_db');
var dest = new PouchDB('local_destination');

Promise.all([
  source.dump(stream),
  dest.load(stream)
]).then(function () {
  console.log('Hooray the stream replication is complete!');
}).catch(function (err) {
  console.log('oh no an error', err);
});
```

This will also work in the browser if you are using [Browserify](http://browserify.org).

If you aren't using Browserify, then you can download `MemoryStream` from [https://wzrd.in/standalone/memorystream@latest](https://wzrd.in/standalone/memorystream@latest) and it will be available as `window.memorystream`.

Example:

```html
<script src="lib/pouchdb/dist/pouchdb.js"></script>
<script src="lib/pouchdb-replication-stream/dist/pouchdb.replication-stream.js"></script>
<script src="lib/memorystream/memorystream.js"></script>
```

```js
var localDB = new PouchDB('foo');
var remoteDB = new PouchDB('bar');

var source = new PouchDB('http://localhost:5984/source_db');
var dest = new PouchDB('local_destination');

Promise.all([
  source.dump(stream),
  dest.load(stream)
]).then(function () {
  console.log('Hooray the stream replication is complete!');
}).catch(function (err) {
  console.log('oh no an error', err);
});
```

Dumping to a string
---

You can use [`MemoryStream`](https://github.com/JSBizon/node-memorystream) to read in the entire
stream and dump it to a string.



Example:

```js
var PouchDB = require('pouchdb');
var replicationStream = require('pouchdb-replication-stream');
var MemoryStream = require('memorystream');

PouchDB.plugin(replicationStream.plugin);
PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);

var dumpedString = '';
var stream = new MemoryStream();
stream.on('data', function(chunk) {
  dumpedString += chunk.toString();
});

var db = new PouchDB('my_db');

db.dump(stream).then(function () {
  console.log('Yay, I have a dumpedString: ' + dumpedString);
}).catch(function (err) {
  console.log('oh no an error', err);
});
```

This will also work in the browser via [Browserify](http://browserify.org/).

If you aren't using Browserify, then you can download `MemoryStream` from [https://wzrd.in/standalone/memorystream@latest](https://wzrd.in/standalone/memorystream@latest) and it will be available as `window.memorystream`.

Example:

```html
<script src="lib/pouchdb/dist/pouchdb.js"></script>
<script src="lib/pouchdb-replication-stream/dist/pouchdb.replication-stream.js"></script>
<script src="lib/memorystream/memorystream.js"></script>
```

```js
var db = new PouchDB('my_db');

var MemoryStream = window.MemoryStream;

var dumpedString = '';
stream.on('data', function(chunk) {
  dumpedString += chunk.toString();
});

db.dump(stream).then(function () {
  console.log('Yay, I have a dumpedString: ' + dumpedString);
}).catch(function (err) {
  console.log('oh no an error', err);
});
```

Known pitfalls
---

### Read error 400 ECONNRESET

Basically this means your CouchDB cannot handle all concurrent requests happening. Most probable cause is you have 200+ attachments on one of your documents.

One simple way to get around this error is to limit the globalAgent maxSockets, which manages the maximum number of concurret http requests.

```js
require('http').globalAgent.maxSockets = 25;
```

### Trying to speed up PouchDB replication?

If you are using this library in the browser, then it's not going to speed up replication. The whole point is to minify the number of HTTP requests by collapsing replication into a stream, and then sending one big chunk down the wire to the client. If you use it on the client side, then it will still make many small requests to the server, which is slow.

What you probably want is to use this library server-side, in a Node.js process. For a good example, see the Express wrapper: [express-pouchdb-replication-stream](https://github.com/conor-mac-aoidh/express-pouchdb-replication-stream).

Building
----
    npm install
    npm run build

Your plugin is now located at `dist/pouchdb.mypluginname.js` and `dist/pouchdb.mypluginname.min.js` and is ready for distribution.

Testing
----

### In Node

This will run the tests in Node using LevelDB:

    npm test

You can also check for 100% code coverage using:

    npm run coverage

If you don't like the coverage results, change the values from 100 to something else in `package.json`, or add `/*istanbul ignore */` comments.


If you have mocha installed globally you can run single test with:
```
TEST_DB=local mocha --reporter spec --grep search_phrase
```

The `TEST_DB` environment variable specifies the database that PouchDB should use (see `package.json`).

### In the browser

Run `npm run dev` and then point your favorite browser to [http://127.0.0.1:8001/test/index.html](http://127.0.0.1:8001/test/index.html).

The query param `?grep=mysearch` will search for tests matching `mysearch`.

### Automated browser tests

You can run e.g.

    CLIENT=selenium:firefox npm test
    CLIENT=selenium:phantomjs npm test

This will run the tests automatically and the process will exit with a 0 or a 1 when it's done. Firefox uses IndexedDB, and PhantomJS uses WebSQL.
