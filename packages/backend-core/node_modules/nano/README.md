[![NPM](http://img.shields.io/npm/v/nano.svg?style=flat-square)](https://www.npmjs.com/package/nano)

# Nano

Offical [Apache CouchDB](https://couchdb.apache.org/) library for [Node.js](https://nodejs.org/).

Features:

* **Minimalistic** - There is only a minimum of abstraction between you and
  CouchDB.
* **Pipes** - Proxy requests from CouchDB directly to your end user. ( `...AsStream` functions only)
* **Promises** - The vast majority of library calls return native Promises.
* **TypeScript** - Detailed TypeScript definitions are built in.
* **Errors** - Errors are proxied directly from CouchDB: if you know CouchDB
  you already know `nano`.

## Installation

1. Install [npm][1]
2. `npm install nano`

or save `nano` as a dependency of your project with

    npm install --save nano

Note the minimum required version of Node.js is 10.

## Table of contents

- [Getting started](#getting-started)
- [Tutorials & screencasts](#tutorials-examples-in-the-wild--screencasts)
- [Configuration](#configuration)
- [Database functions](#database-functions)
  - [nano.db.create(name, [callback])](#nanodbcreatename-callback)
  - [nano.db.get(name, [callback])](#nanodbgetname-callback)
  - [nano.db.destroy(name, [callback])](#nanodbdestroyname-callback)
  - [nano.db.list([callback])](#nanodblistcallback)
  - [nano.db.listAsStream()](#nanodblistasstream)
  - [nano.db.compact(name, [designname], [callback])](#nanodbcompactname-designname-callback)
  - [nano.db.replicate(source, target, [opts], [callback])](#nanodbreplicatesource-target-opts-callback)
  - [nano.db.replication.enable(source, target, [opts], [callback])](#nanodbreplicationenablesource-target-opts-callback)
  - [nano.db.replication.query(id, [opts], [callback])](#nanodbreplicationenablesource-target-opts-callback)
  - [nano.db.replication.disable(id, [opts], [callback])](#nanodbreplicationdisableid-opts-callback)
  - [nano.db.changes(name, [params], [callback])](#nanodbchangesname-params-callback)
  - [nano.db.changesAsStream(name, [params])](#nanodbchangesasstreamname-params)
  - [nano.db.info([callback])](#nanodbinfocallback)
  - [nano.use(name)](#nanousename)
  - [nano.request(opts, [callback])](#nanorequestopts-callback)
  - [nano.config](#nanoconfig)
  - [nano.updates([params], [callback])](#nanoupdatesparams-callback)
  - [nano.info([callback])](#nanoinfocallback)

- [Document functions](#document-functions)
  - [db.insert(doc, [params], [callback])](#dbinsertdoc-params-callback)
  - [db.destroy(docname, rev, [callback])](#dbdestroydocname-rev-callback)
  - [db.get(docname, [params], [callback])](#dbgetdocname-params-callback)
  - [db.head(docname, [callback])](#dbheaddocname-callback)
  - [db.bulk(docs, [params], [callback])](#dbbulkdocs-params-callback)
  - [db.list([params], [callback])](#dblistparams-callback)
  - [db.listAsStream([params])](#dblistasstreamparams)
  - [db.fetch(docnames, [params], [callback])](#dbfetchdocnames-params-callback)
  - [db.fetchRevs(docnames, [params], [callback])](#dbfetchrevsdocnames-params-callback)
  - [db.createIndex(indexDef, [callback])](#dbcreateindexindexdef-callback)
  - [db.changesReader](#reading-changes-feed)
- [Partitioned database functions](#partition-functions)
  - [db.partitionInfo(partitionKey, [callback])](#dbpartitioninfopartitionkey-callback))
  - [db.partitionedList(partitionKey, [params], [callback])](#dbpartitionedlistpartitionkey-params-callback)
  - [db.partitionedListAsStream(partitionKey, [params])](#dbpartitionedlistasstreampartitionkey-params)
  - [db.partitionedFind(partitionKey, query, [callback])](#dbpartitionedfindpartitionkey-query-params)
  - [db.partitionedFindAsStream(partitionKey, query)](#dbpartitionedfindasstreampartitionkey-query)
  - [db.partitionedSearch(partitionKey, designName, searchName, params, [callback])](#dbpartitionedsearchpartitioney-designname-searchname-params-callback)
  - [db.partitionedSearchAsStream(partitionKey, designName, searchName, params)](#dbpartitionedsearchasstreampartitionkey-designName-searchName-params)
  - [db.partitionedView(partitionKey, designName, viewName, [params], [callback])](#dbpartitionediewpartitionkey-designname-viewname-params-callback)
  - [db.partitionedViewAsStream(partitionKey, designName, viewName, [params])](#dbpartitionediewasstreampartitionkey-designname-viewname-params)
- [Multipart functions](#multipart-functions)
  - [db.multipart.insert(doc, attachments, [params], [callback])](#dbmultipartinsertdoc-attachments-params-callback)
  - [db.multipart.get(docname, [params], [callback])](#dbmultipartgetdocname-params-callback)
- [Attachments functions](#attachments-functions)
  - [db.attachment.insert(docname, attname, att, contenttype, [params], [callback])](#dbattachmentinsertdocname-attname-att-contenttype-params-callback)
  - [db.attachment.insertAsStream(docname, attname, att, contenttype, [params])](#dbattachmentinsertasstreamdocname-attname-att-contenttype-params)
  - [db.attachment.get(docname, attname, [params], [callback])](#dbattachmentgetdocname-attname-params-callback)
  - [db.attachment.getAsStream(docname, attname, [params])](#dbattachmentgetasstreamdocname-attname-params)
  - [db.attachment.destroy(docname, attname, [params], [callback])](#dbattachmentdestroydocname-attname-params-callback)
- [Views and design functions](#views-and-design-functions)
  - [db.view(designname, viewname, [params], [callback])](#dbviewdesignname-viewname-params-callback)
  - [db.viewAsStream(designname, viewname, [params])](#dbviewasstreamdesignname-viewname-params)
  - [db.viewWithList(designname, viewname, listname, [params])](#dbviewwithlistdesignname-viewname-params)
  - [db.viewWithListAsStream(designname__viewname, listname, [params])](#dbviewwithlistasstreamdesignname-viewname-params)
  - [db.show(designname, showname, doc_id, [params], [callback])](#dbshowdesignname-showname-doc_id-params-callback)
  - [db.atomic(designname, updatename, docname, [body], [callback])](#dbatomicdesignname-updatename-docname-body-callback)
  - [db.search(designname, viewname, params, [callback])](#dbsearchdesignname-searchname-params-callback)
  - [db.searchAsStream(designname, viewname, params)](#dbsearchasstreamdesignname-searchname-params)
  - [db.find(selector, [callback])](#dbfindselector-callback)
  - [db.findAsStream(selector)](#dbfindasstreamselector)
- [Using cookie authentication](#using-cookie-authentication)
- [Advanced features](#advanced-features)
  - [getting uuids](#getting-uuids)
  - [extending nano](#extending-nano)
  - [pipes](#pipes)
- [Tests](#tests)
- [Release](#release)

## Getting started

To use `nano` you need to connect it to your CouchDB install, to do that:

```js
const nano = require('nano')('http://localhost:5984');
```

> Note: The URL you supply may also contain authentication credentials e.g. `http://admin:mypassword@localhost:5984`.

To create a new database:

```js
nano.db.create('alice');
```

and to use an existing database:

```js
const alice = nano.db.use('alice');
```

Under-the-hood, calls like `nano.db.create` are making HTTP API calls to the CouchDB service. Such operations are *asynchronous*. There are two ways to receive the asynchronous data back from the library

1) Promises

```js
nano.db.create('alice').then((data) => {
  // success - response is in 'data'
}).catch((err) => {
  // failure - error information is in 'err'
})
```

or in the async/await style:

```js
try {
  const response = await nano.db.create('alice')
  // succeeded
  console.log(response)
} catch (e) {
  // failed
  console.error(e)
}
```

2) Callbacks

```js
nano.db.create('alice', (err, data) => {
  // errors are in 'err' & response is in 'data'
})
```

In `nano` the callback function receives always three arguments:

* `err` - The error, if any.
* `body` - The HTTP _response body_ from CouchDB, if no error.
  JSON parsed body, binary for non JSON responses.
* `header` - The HTTP _response header_ from CouchDB, if no error.

The documentation will follow the *async/await* style.

------------------


A simple but complete example in the [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) style:

```js
async function asyncCall() {
  await nano.db.destroy('alice')
  await nano.db.create('alice')
  const alice = nano.use('alice')
  const response = await alice.insert({ happy: true }, 'rabbit')
  return response
}
asyncCall()
```

Running this example will produce:

```
you have inserted a document with an _id of rabbit.
{ ok: true,
  id: 'rabbit',
  rev: '1-6e4cb465d49c0368ac3946506d26335d' }
```

You can also see your document in futon (http://localhost:5984/_utils).

## Configuration

Configuring nano to use your database server is as simple as:

```js
const nano = require('nano')('http://localhost:5984')
const db = nano.use('foo');
```

If you don't need to instrument database objects you can simply:

```js
// nano parses the URL and knows this is a database
const db = require('nano')('http://localhost:5984/foo');
```

You can also pass options to the require to specify further configuration options you can pass an object literal instead:

```js
// nano parses the URL and knows this is a database
const opts = {
  url: 'http://localhost:5984/foo',
  requestDefaults: {
    proxy: {
      protocol: 'http',
      host: 'myproxy.net'
    },
    headers: {
      customheader: 'MyCustomHeader'
    }
  }
};
const db = require('nano')(opts);
```

Nano works perfectly well over HTTPS as long as the SSL cert is signed by a certification authority known by your client operating system. If you have a custom or self-signed certificate, you may need to create your own HTTPS agent and pass it to Nano e.g.

```js
const httpsAgent = new https.Agent({
  ca: '/path/to/cert',
  rejectUnauthorized: true,
  keepAlive: true,
  maxSockets: 6
})
const nano = Nano({
  url: process.env.COUCH_URL,
  requestDefaults: {
    agent: httpsAgent,
  }
})
```

Please check [axios] for more information on the defaults. They support features like proxies, timeout etc.

You can tell nano to not parse the URL (maybe the server is behind a proxy, is accessed through a rewrite rule or other):

```js
// nano does not parse the URL and return the server api
// "http://localhost:5984/prefix" is the CouchDB server root
const couch = require('nano')(
  { url : "http://localhost:5984/prefix"
    parseUrl : false
  });
const db = couch.use('foo');
```

### Pool size and open sockets

A very important configuration parameter if you have a high traffic website and are using `nano` is the HTTP pool size. By default, the Node.js HTTP global agent has a infinite number of active connections that can run simultaneously. This can be limited to user-defined number (`maxSockets`) of requests that are "in flight", while others are kept in a queue. Here's an example explicitly using the Node.js HTTP agent configured with [custom options](https://nodejs.org/api/http.html#http_new_agent_options):

```js
const http = require('http')
const myagent = new http.Agent({
  keepAlive: true,
  maxSockets: 25
})

const db = require('nano')({
  url: 'http://localhost:5984/foo',
  requestDefaults : {
    agent : myagent
  }
});
```

## TypeScript

There is a full TypeScript definition included in the the *nano* package. Your TypeScript editor will show you hints as you write your code with the *nano* library with your own custom classes:

```ts
import * as Nano  from 'nano'

let n = Nano('http://USERNAME:PASSWORD@localhost:5984')
let db = n.db.use('people')

interface iPerson extends Nano.MaybeDocument {
  name: string,
  dob: string
}

class Person implements iPerson {
  _id: string
  _rev: string
  name: string
  dob: string

  constructor(name: string, dob: string) {
    this._id = undefined
    this._rev = undefined
    this.name = name
    this.dob = dob
  }

  processAPIResponse(response: Nano.DocumentInsertResponse) {
    if (response.ok === true) {
      this._id = response.id
      this._rev = response.rev
    }
  }
}

let p = new Person('Bob', '2015-02-04')
db.insert(p).then((response) => {
  p.processAPIResponse(response)
  console.log(p)
})
```

## Database functions

### nano.db.create(name, [opts], [callback])

Creates a CouchDB database with the given `name`, with options `opts`.

```js
await nano.db.create('alice', { n: 3 })
```

### nano.db.get(name, [callback])

Get information about the database `name`:

```js
const info = await nano.db.get('alice')
```

### nano.db.destroy(name, [callback])

Destroys the database `name`:

```js
await nano.db.destroy('alice')
```

### nano.db.list([callback])

Lists all the CouchDB databases:

```js
const dblist = await nano.db.list()
```

### nano.db.listAsStream()

Lists all the CouchDB databases as a stream:

```js
nano.db.listAsStream()
  .on('error', (e) => console.error('error', e))
  .pipe(process.stdout);
```

### nano.db.compact(name, [designname], [callback])

Compacts `name`, if `designname` is specified also compacts its views.

### nano.db.replicate(source, target, [opts], [callback])

Replicates `source` to `target` with options `opts`. The `target`database
has to exist, add `create_target:true` to `opts` to create it prior to
replication:

```js
const response = await nano.db.replicate('alice',
                  'http://admin:password@otherhost.com:5984/alice',
                  { create_target:true })
```

### nano.db.replication.enable(source, target, [opts], [callback])

Enables replication using the new CouchDB api from `source` to `target`
with options `opts`. `target` has to exist, add `create_target:true` to
`opts` to create it prior to replication. Replication will survive server restarts.

```js
const response = await nano.db.replication.enable('alice',
                  'http://admin:password@otherhost.com:5984/alice',
                  { create_target:true })
```

### nano.db.replication.query(id, [opts], [callback])

Queries the state of replication using the new CouchDB API. The `id` comes from the response
given by the call to `replication.enable`:

```js
const r = await nano.db.replication.enable('alice',
                  'http://admin:password@otherhost.com:5984/alice',
                   { create_target:true })
const q = await nano.db.replication.query(r.id)
```

### nano.db.replication.disable(id, [opts], [callback])

Disables replication using the new CouchDB API. The `id` comes from the response given
by the call to `replication.enable`:

```js
const r = await nano.db.replication.enable('alice',
                   'http://admin:password@otherhost.com:5984/alice',
                   { create_target:true })
await nano.db.replication.disable(r.id);
```

### nano.db.changes(name, [params], [callback])

Asks for the changes feed of `name`, `params` contains additions
to the query string.

```js
const c = await nano.db.changes('alice')
```

### nano.db.changesAsStream(name, [params])

Same as `nano.db.changes` but returns a stream.

```js
nano.db.changes('alice').pipe(process.stdout);
```

### nano.db.info([callback])

Gets database information:

```js
const info = await nano.db.info()
```

### nano.use(name)

Returns a database object that allows you to perform operations against that database:

```js
const alice = nano.use('alice');
await alice.insert({ happy: true }, 'rabbit')
```

The database object can be used to access the [Document Functions](#document-functions).

### nano.db.use(name)

Alias for `nano.use`

### nano.db.scope(name)

Alias for `nano.use`

### nano.scope(name)

Alias for `nano.use`

### nano.request(opts, [callback])

Makes a custom request to CouchDB. This can be used to create your own HTTP request to the CouchDB
server, to perform operations where there is no `nano` function that encapsulates it. The available `opts` are:

* `opts.db` – the database name
* `opts.method` – the http method, defaults to `get`
* `opts.path` – the full path of the request, overrides `opts.doc` and
  `opts.att`
* `opts.doc` – the document name
* `opts.att` – the attachment name
* `opts.qs` – query string parameters, appended after any existing `opts.path`, `opts.doc`, or `opts.att`
* `opts.content_type` – the content type of the request, default to `json`
* `opts.headers` – additional http headers, overrides existing ones
* `opts.body` – the document or attachment body
* `opts.encoding` – the encoding for attachments
* `opts.multipart` – array of objects for multipart request
* `opts.stream` - if `true`, a `request` object is returned. Default `false` and a Promise is returned.

### nano.relax(opts, [callback])

Alias for `nano.request`

### nano.config

An object containing the `nano` configurations, possible keys are:

* `url` - the CouchDB URL
* `db` - the database name

### nano.updates([params], [callback])

Listen to db updates, the available `params` are:

* `params.feed` – Type of feed. Can be one of
 * `longpoll`: Closes the connection after the first event.
 * `continuous`: Send a line of JSON per event. Keeps the socket open until timeout.
 * `eventsource`: Like, continuous, but sends the events in EventSource format.
* `params.timeout` – Number of seconds until CouchDB closes the connection. Default is 60.
* `params.heartbeat` – Whether CouchDB will send a newline character (\n) on timeout. Default is true.

## Document functions

### db.insert(doc, [params], [callback])

Inserts `doc` in the database with optional `params`. If params is a string, it's assumed it is the intended document `_id`. If params is an object, it's passed as query string parameters and `docName` is checked for defining the document `_id`:

```js
const alice = nano.use('alice');
const response = await alice.insert({ happy: true }, 'rabbit')
```

The `insert` function can also be used with the method signature `db.insert(doc,[callback])`, where the `doc` contains the `_id` field e.g.

```js
const alice = nano.use('alice')
const response = await alice.insert({ _id: 'myid', happy: true })
```

and also used to update an existing document, by including the `_rev` token in the document being saved:

```js
const alice = nano.use('alice')
const response = await alice.insert({ _id: 'myid', _rev: '1-23202479633c2b380f79507a776743d5', happy: false })
```

### db.destroy(docname, rev, [callback])

Removes a document from CouchDB whose `_id` is `docname` and who's revision is `_rev`:

```js
const response = await alice.destroy('rabbit', '3-66c01cdf99e84c83a9b3fe65b88db8c0')
```

### db.get(docname, [params], [callback])

Gets a document from CouchDB whose `_id` is `docname`:

```js
const doc = await alice.get('rabbit')
```

or with optional [query string `params`](https://docs.couchdb.org/en/stable/api/document/common.html#get--db-docid):

```js
const doc = await alice.get('rabbit', { revs_info: true })
```

If you pass `attachments=true`, the `doc._attachments.attachmentNameN.data` fields will contain the 
[base-64 encoded attachments](https://docs.couchdb.org/en/stable/json-structure.html#document-with-attachments).
Or, you can use [`db.multipart.get`](https://github.com/DougReeder/couchdb-nano#dbmultipartgetdocname-params-callback)
and parse the returned buffer to get the document and attachments.

See the [attachments methods](https://github.com/apache/couchdb-nano#attachments-functions) to retrieve
*just* an attachment.

### db.head(docname, [callback])

Same as `get` but lightweight version that returns headers only:

```js
const headers = await alice.head('rabbit')
```

*Note:* if you call `alice.head` in the callback style, the headers are returned to you as the third argument of the callback function.

### db.bulk(docs, [params], [callback])

Bulk operations(update/delete/insert) on the database, refer to the
[CouchDB doc](https://docs.couchdb.org/en/2.1.1/api/database/bulk-api.html#db-bulk-docs) e.g:

```js
const documents = [
  { a:1, b:2 },
  { _id: 'tiger', striped: true}
];
const response = await alice.bulk({ docs: documents })
```

### db.list([params], [callback])

List all the docs in the database .

```js
const doclist = await alice.list().then((body)
doclist.rows.forEach((doc) => {
  console.log(doc);
});
```

or with optional query string additions `params`:

```js
const doclist = await alice.list({include_docs: true})
```

### db.listAsStream([params])

List all the docs in the database as a stream.

```js
alice.listAsStream()
  .on('error', (e) => console.error('error', e))
  .pipe(process.stdout)
```

### db.fetch(docnames, [params], [callback])

Bulk fetch of the database documents, `docnames` are specified as per
[CouchDB doc](https://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_all_docs).
additional query string `params` can be specified, `include_docs` is always set
to `true`.

```js
const keys = ['tiger', 'zebra', 'donkey'];
const datat = await alice.fetch({keys: keys})
```

### db.fetchRevs(docnames, [params], [callback])

** changed in version 6 **

Bulk fetch of the revisions of the database documents, `docnames` are specified as per
[CouchDB doc](https://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_all_docs).
additional query string `params` can be specified, this is the same method as fetch but
 `include_docs` is not automatically set to `true`.

### db.createIndex(indexDef, [callback])

Create index on database fields, as specified in
[CouchDB doc](https://docs.couchdb.org/en/latest/api/database/find.html#db-index).

```js
const indexDef = {
  index: { fields: ['foo'] },
  name: 'fooindex'
};
const response = await alice.createIndex(indexDef)
```

## Reading Changes Feed

Nano provides a low-level API for making calls to CouchDB's changes feed, or if you want a 
reliable, resumable changes feed follower, then you need the `changesReader`.

There are three ways to start listening to the changes feed:

1. `changesReader.start()` - to listen to changes indefinitely by repeated "long poll" requests. This mode continues to poll for changes until `changesReader.stop()` is called, at which point any active long poll will be canceled.
2. `changesReader.get()` - to listen to changes until the end of the changes feed is reached, by repeated "long poll" requests. Once a response with zero changes is received, the 'end' event will indicate the end of the changes and polling will stop.
3. `changesReader.spool()` - listen to changes in one long HTTP request. (as opposed to repeated round trips) - spool is faster but less reliable.

> Note: for `.get()` & `.start()`, the sequence of API calls can be paused by calling `changesReader.pause()` and resumed by calling `changesReader.resume()`.

Set up your database connection and then choose `changesReader.start()` to listen to that database's changes:

```js
const db = nano.db.use('mydb')
db.changesReader.start()
  .on('change', (change) => { console.log(change) })
  .on('batch', (b) => {
    console.log('a batch of', b.length, 'changes has arrived');
  }).on('seq', (s) => {
    console.log('sequence token', s);
  }).on('error', (e) => {
    console.error('error', e);
  })
```

> Note: you probably want to monitor *either* the `change` or `batch` event, not both.

If you want `changesReader` to hold off making the next `_changes` API call until you are ready, then supply `wait:true` in the options to `get`/`start`. The next request will only fire when you call `changesReader.resume()`:

```js
db.changesReader.get({wait: true})
  .on('batch', (b) => {
    console.log('a batch of', b.length, 'changes has arrived');
    // do some asynchronous work here and call "changesReader.resume()"
    // when you're ready for the next API call to be dispatched.
    // In this case, wait 5s before the next changes feed request.
    setTimeout( () => {
      db.changesReader.resume()
    }, 5000)
  }).on('end', () => {
    console.log('changes feed monitoring has stopped');
  });
```

You may supply a number of options when you start to listen to the changes feed:

| Parameter | Description                                                                                                                                                                             | Default value | e.g.                            |   |
|-----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|---------------------------------|---|
| batchSize | The maximum number of changes to ask CouchDB for per HTTP request. This is the maximum number of changes you will receive in a `batch` event. | 100           | 500                             |   |
| since     | The position in the changes feed to start from where `0` means the beginning of time, `now` means the current position or a string token indicates a fixed position in the changes feed | now           | 390768-g1AAAAGveJzLYWBgYMlgTmGQ |   |
| includeDocs | Whether to include document bodies or not | false | e.g. true |
| wait | For `get`/`start` mode, automatically pause the changes reader after each request. When the the user calls `resume()`, the changes reader will resume.  | false | e.g. true |
| fastChanges | Adds a seq_interval parameter to fetch changes more quickly | false           | true                             |   |
| selector | Filters the changes feed with the supplied Mango selector | {"name":"fred}           | null                             |   |
| timeout | The number of milliseconds a changes feed request waits for data| 60000         | 10000    |

The events it emits are as follows:s

| Event  | Description                                                                                                                                                               | Data                       |   |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------|---|
| change | Each detected change is emitted individually. Only available in `get`/`start` modes.                                                                                                                          | A change object            |   |
| batch  | Each batch of changes is emitted in bulk in quantities up to `batchSize`.                                                                                                                              | An array of change objects |   |
| seq    | Each new sequence token (per HTTP request). This token can be passed into `ChangesReader` as the `since` parameter to resume changes feed consumption from a known point. Only available in `get`/`start` modes. | String                     |   |
| error  | On a fatal error, a descriptive object is returned and change consumption stops.                                                                                         | Error object               |   |
| end    | Emitted when the end of the changes feed is reached. `ChangesReader.get()` mode only,                                                                                     | Nothing                    |   |

The *ChangesReader* library will handle many temporal errors such as network connectivity, service capacity limits and malformed data but it will emit an `error` event and exit when fed incorrect authentication credentials or an invalid `since` token.

The `change` event delivers a change object that looks like this:

```js
{
	"seq": "8-g1AAAAYIeJyt1M9NwzAUBnALKiFOdAO4gpRix3X",
	"id": "2451be085772a9e588c26fb668e1cc52",
	"changes": [{
		"rev": "4-061b768b6c0b6efe1bad425067986587"
	}],
	"doc": {
		"_id": "2451be085772a9e588c26fb668e1cc52",
		"_rev": "4-061b768b6c0b6efe1bad425067986587",
		"a": 3
	}
}
```

N.B

- `doc` is only present if `includeDocs:true` is supplied
- `seq` is not present for every change

The `id` is the unique identifier of the document that changed and the `changes` array contains the document revision tokens that were written to the database.

The `batch` event delivers an array of change objects.

## Partition Functions

Functions related to [partitioned databases](https://docs.couchdb.org/en/latest/partitioned-dbs/index.html).

Create a partitioned database by passing `{ partitioned: true }` to `db.create`:

```js
await nano.db.create('my-partitioned-db', { partitioned: true })
```

The database can be used as normal:

```js
const db = nano.db.use('my-partitioned-db')
```

but documents must have a two-part `_id` made up of `<partition key>:<document id>`. They are insert with `db.insert` as normal:

```js
const doc = { _id: 'canidae:dog', name: 'Dog', latin: 'Canis lupus familiaris' }
await db.insert(doc)
```

Documents can be retrieved by their `_id` using `db.get`:

```js
const doc = db.get('canidae:dog')
```

Mango indexes can be created to operate on a per-partition index by supplying `partitioned: true` on creation:

```js
const i = {
  ddoc: 'partitioned-query',
  index: { fields: ['name'] },
  name: 'name-index',
  partitioned: true,
  type: 'json'
}

// instruct CouchDB to create the index
await db.index(i)
```

Search indexes can be created by writing a design document with `opts.partitioned = true`:

```js
// the search definition
const func = function(doc) {
  index('name', doc.name)
  index('latin', doc.latin)
}

// the design document containing the search definition function
const ddoc = {
  _id: '_design/search-ddoc',
  indexes: {
    search-index: {
      index: func.toString()
    }
  },
  options: {
    partitioned: true
  }
}
 
await db.insert(ddoc)
```

MapReduce views can be created by writing a design document with `opts.partitioned = true`:

```js
const func = function(doc) {
  emit(doc.family, doc.weight)
}

// Design Document
const ddoc = {
  _id: '_design/view-ddoc',
  views: {
    family-weight: {
      map: func.toString(),
      reduce: '_sum'
    }
  },
  options: {
    partitioned: true
  }
}

// create design document
await db.insert(ddoc)
```

### db.partitionInfo(partitionKey, [callback])

Fetch the stats of a single partition:

```js
const stats = await alice.partitionInfo('canidae')
```

### db.partitionedList(partitionKey, [params], [callback])

Fetch documents from a database partition:

```js
// fetch document id/revs from a partition
const docs = await alice.partitionedList('canidae')

// add document bodies but limit size of response
const docs = await alice.partitionedList('canidae', { include_docs: true, limit: 5 })
```

### db.partitionedListAsStream(partitionKey, [params])

Fetch documents from a partition as a stream:

```js
// fetch document id/revs from a partition
nano.db.partitionedListAsStream('canidae')
  .on('error', (e) => console.error('error', e))
  .pipe(process.stdout)

// add document bodies but limit size of response
nano.db.partitionedListAsStream('canidae', { include_docs: true, limit: 5 })
  .on('error', (e) => console.error('error', e))
  .pipe(process.stdout)
```

### db.partitionedFind(partitionKey, query, [params])

Query documents from a partition by supplying a Mango selector:

```js
// find document whose name is 'wolf' in the 'canidae' partition
await db.partitionedFind('canidae', { 'selector' : { 'name': 'Wolf' }})
```

### db.partitionedFindAsStream(partitionKey, query)

Query documents from a partition by supplying a Mango selector as a stream:

```js
// find document whose name is 'wolf' in the 'canidae' partition
db.partitionedFindAsStream('canidae', { 'selector' : { 'name': 'Wolf' }})
  .on('error', (e) => console.error('error', e))
  .pipe(process.stdout)
```

### db.partitionedSearch(partitionKey, designName, searchName, params, [callback])

Search documents from a partition by supplying a Lucene query:

```js
const params = {
  q: 'name:\'Wolf\''
}
await db.partitionedSearch('canidae', 'search-ddoc', 'search-index', params)
// { total_rows: ... , bookmark: ..., rows: [ ...] }
```

### db.partitionedSearchAsStream(partitionKey, designName, searchName, params)

Search documents from a partition by supplying a Lucene query as a stream:

```js
const params = {
  q: 'name:\'Wolf\''
}
db.partitionedSearchAsStream('canidae', 'search-ddoc', 'search-index', params)
  .on('error', (e) => console.error('error', e))
  .pipe(process.stdout)
// { total_rows: ... , bookmark: ..., rows: [ ...] }
```

### db.partitionedView(partitionKey, designName, viewName, params, [callback])

Fetch documents from a MapReduce view from a partition:

```js
const params = {
  startkey: 'a',
  endkey: 'b',
  limit: 1
}
await db.partitionedView('canidae', 'view-ddoc', 'view-name', params)
// { rows: [ { key: ... , value: [Object] } ] }
```

### db.partitionedViewAsStream(partitionKey, designName, viewName, params)

Fetch documents from a MapReduce view from a partition as a stream:

```js
const params = {
  startkey: 'a',
  endkey: 'b',
  limit: 1
}
db.partitionedViewAsStream('canidae', 'view-ddoc', 'view-name', params)
  .on('error', (e) => console.error('error', e))
  .pipe(process.stdout)
// { rows: [ { key: ... , value: [Object] } ] }
```

## Multipart functions

### db.multipart.insert(doc, attachments, params, [callback])

Inserts a `doc` together with `attachments` and `params`. If params is a string, it's assumed as the intended document `_id`. If params is an object, its passed as query string parameters and `docName` is checked for defining the `_id`. Refer to the [doc](https://docs.couchdb.org/en/stable/api/document/common.html) for more details.
 The `attachments` parameter must be an array of objects with `name`, `data` and `content_type` properties.

```js
const fs = require('fs');

fs.readFile('rabbit.png', (err, data) => {
  if (!err) {
    await alice.multipart.insert({ foo: 'bar' }, [{name: 'rabbit.png', data: data, content_type: 'image/png'}], 'mydoc')
  }
});
```

### db.multipart.get(docname, [params], [callback])

Get `docname` together with its attachments via `multipart/related` request with optional [query string additions](https://docs.couchdb.org/en/stable/api/document/common.html#get--db-docid). The multipart response body is a `Buffer`.

```js
const response = await alice.multipart.get('rabbit')
```

## Attachments functions

### db.attachment.insert(docname, attname, att, contenttype, [params], [callback])

Inserts an attachment `attname` to `docname`, in most cases
 `params.rev` is required. Refer to the
 [CouchDB doc](https://docs.couchdb.org/en/latest/api/document/attachments.html#db-doc-attachment) for more details.

```js
const fs = require('fs');

fs.readFile('rabbit.png', (err, data) => {
  if (!err) {
    await alice.attachment.insert('rabbit', 
      'rabbit.png', 
      data, 
      'image/png',
      { rev: '12-150985a725ec88be471921a54ce91452' })
  }
});
```

### db.attachment.insertAsStream(docname, attname, att, contenttype, [params])

As of Nano 9.x, the function `db.attachment.insertAsStream` is now deprecated. Now simply pass
a readable stream to `db.attachment.insert` as the third paramseter.

### db.attachment.get(docname, attname, [params], [callback])

Get `docname`'s attachment `attname` with optional query string additions
`params`.

```js
const fs = require('fs');

const body = await alice.attachment.get('rabbit', 'rabbit.png')
fs.writeFile('rabbit.png', body)
```

### db.attachment.getAsStream(docname, attname, [params])

```js
const fs = require('fs');
alice.attachment.getAsStream('rabbit', 'rabbit.png')
  .on('error', e => console.error)
  .pipe(fs.createWriteStream('rabbit.png'));
```

### db.attachment.destroy(docname, attname, [params], [callback])

**changed in version 6**

Destroy attachment `attname` of `docname`'s revision `rev`.

```js
const response = await alice.attachment.destroy('rabbit', 'rabbit.png', {rev: '1-4701d73a08ce5c2f2983bf7c9ffd3320'})
```

## Views and design functions

### db.view(designname, viewname, [params], [callback])

Calls a view of the specified `designname` with optional query string `params`. If you're looking to filter the view results by key(s) pass an array of keys, e.g
`{ keys: ['key1', 'key2', 'key_n'] }`, as `params`.

```js
const body = await alice.view('characters', 'happy_ones', { key: 'Tea Party', include_docs: true })
body.rows.forEach((doc) => {
  console.log(doc.value)
})
```

or

```js
const body = await alice.view('characters', 'soldiers', { keys: ['Hearts', 'Clubs'] })
```

When `params` is not supplied, or no keys are specified, it will simply return all documents in the view:

```js
const body = await alice.view('characters', 'happy_ones')
```

```js
const body = alice.view('characters', 'happy_ones', { include_docs: true })
```

### db.viewAsStream(designname, viewname, [params])

Same as `db.view` but returns a stream:

```js
alice.viewAsStream('characters', 'happy_ones', {reduce: false})
  .on('error', (e) => console.error('error', e))
  .pipe(process.stdout);
```

### db.viewWithList(designname, viewname, listname, [params], [callback])

Calls a list function fed by the given view from the specified design document.

```js
const body = await alice.viewWithList('characters', 'happy_ones', 'my_list')
```

### db.viewWithListAsStream(designname, viewname, listname, [params], [callback])

Calls a list function fed by the given view from the specified design document as a stream.

```js
alice.viewWithListAsStream('characters', 'happy_ones', 'my_list')
  .on('error', (e) => console.error('error', e))
  .pipe(process.stdout);
```

### db.show(designname, showname, doc_id, [params], [callback])

Calls a show function from the specified design for the document specified by doc_id with
optional query string additions `params`.

```js
const doc = await alice.show('characters', 'format_doc', '3621898430')
```

Take a look at the [CouchDB wiki](https://guide.couchdb.org/draft/show.html)
for possible query paramaters and more information on show functions.

### db.atomic(designname, updatename, docname, [body], [callback])

Calls the design's update function with the specified doc in input.

```js
const response = await db.atomic('update', 'inplace', 'foobar', {field: 'foo', value: 'bar'})
```

Note that the data is sent in the body of the request.
An example update handler follows:

```js
"updates": {
  "in-place" : "function(doc, req) {
      var request_body = JSON.parse(req.body)
      var field = request_body.field
      var value = request_body.value
      var message = 'set ' + field + ' to ' + value
      doc[field] = value
      return [doc, message]
  }"
}
```

### db.search(designname, searchname, params, [callback])

Calls a view of the specified design with optional query string additions `params`.

```js
const response = await alice.search('characters', 'happy_ones', { q: 'cat' })
```

or

```js
const drilldown = [['author', 'Dickens']['publisher','Penguin']]
const response = await alice.search('inventory', 'books', { q: '*:*', drilldown: drilldown })
```

Check out the tests for a fully functioning example.

### db.searchAsStream(designname, searchname, params)

Calls a view of the specified design with optional query string additions `params`. Returns stream.

```js
alice.search('characters', 'happy_ones', { q: 'cat' }).pipe(process.stdout);
```

### db.find(selector, [callback])

Perform a ["Mango" query](https://docs.couchdb.org/en/2.1.1/api/database/find.html) by supplying a JavaScript object containing a selector:

```js
// find documents where the name = "Brian" and age > 25.
const q = {
  selector: {
    name: { "$eq": "Brian"},
    age : { "$gt": 25 }
  },
  fields: [ "name", "age", "tags", "url" ],
  limit:50
};
const response = await alice.find(q)
```

### db.findAsStream(selector)

Perform a ["Mango" query](http://docs.couchdb.org/en/2.1.1/api/database/find.html) by supplying a JavaScript object containing a selector, but return a stream:

```js
// find documents where the name = "Brian" and age > 25.
const q = {
  selector: {
    name: { "$eq": "Brian"},
    age : { "$gt": 25 }
  },
  fields: [ "name", "age", "tags", "url" ],
  limit:50
};
alice.findAsStream(q)
  .on('error', (e) => console.error('error', e))
  .pipe(process.stdout);
```

## using cookie authentication

Nano supports making requests using CouchDB's [cookie authentication](http://guide.couchdb.org/editions/1/en/security.html#cookies) functionality. If you initialise *Nano* so that it is cookie-aware, you may call `nano.auth` first to get a session cookie. Nano will behave like a web browser, remembering your session cookie and refreshing it if a new one is received in a future HTTP response.

```js
const nano = require('nano')({
  url: 'http://localhost:5984',
  requestDefaults: {
    jar: true
  }
})
const username = 'user'
const userpass = 'pass'
const db = nano.db.use('mydb')

// authenticate
await nano.auth(username, userpass)

// requests from now on are authenticated
const doc = await db.get('mydoc')
console.log(doc)
```

The second request works because the `nano` library has remembered the `AuthSession` cookie that was invisibily returned by the `nano.auth` call.

When you have a session, you can see what permissions you have by calling the `nano.session` function

```js
const doc = await nano.session()
// { userCtx: { roles: [ '_admin', '_reader', '_writer' ], name: 'rita' },  ok: true }
```

## Advanced features

### Getting uuids

If your application needs to generate UUIDs, then CouchDB can provide some for you

```js
const response = await nano.uuids(3)
// { uuids: [
// '5d1b3ef2bc7eea51f660c091e3dffa23',
// '5d1b3ef2bc7eea51f660c091e3e006ff',
// '5d1b3ef2bc7eea51f660c091e3e007f0',
//]}
```

The first parameter is the number of uuids to generate. If omitted, it defaults to 1.

### Extending nano

`nano` is minimalistic but you can add your own features with
`nano.request(opts)`

For example, to create a function to retrieve a specific revision of the
`rabbit` document:

```js
function getrabbitrev(rev) {
  return nano.request({ db: 'alice',
                 doc: 'rabbit',
                 method: 'get',
                 params: { rev: rev }
               });
}

getrabbitrev('4-2e6cdc4c7e26b745c2881a24e0eeece2').then((body) => {
  console.log(body);
});
```

### Pipes

You can pipe the return values of certain nano functions like other stream. For example if our `rabbit` document has an attachment with name `picture.png` you can pipe it to a `writable stream`:

```js
const fs = require('fs');
const nano = require('nano')('http://127.0.0.1:5984/');
const alice = nano.use('alice');
alice.attachment.getAsStream('rabbit', 'picture.png')
  .on('error', (e) => console.error('error', e))
  .pipe(fs.createWriteStream('/tmp/rabbit.png'));
```

then open `/tmp/rabbit.png` and you will see the rabbit picture.

Functions that return streams instead of a Promise are:

- nano.db.listAsStream

attachment functions:

- db.attachment.getAsStream
- db.attachment.insertAsStream

and document level functions

- db.listAsStream

### Logging

When instantiating Nano, you may supply the function that will perform the logging of requests and responses. In its simplest for, simply pass `console.log` as your logger:

```js
const nano = Nano({ url: process.env.COUCH_URL, log: console.log })
// all requests and responses will be sent to console.log
```

You may supply your own logging function to format the data before output:

```js
const url = require('url')
const logger = (data) => {
  // only output logging if there is an environment variable set
  if (process.env.LOG === 'nano') {
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
}
const nano = Nano({ url: process.env.COUCH_URL, log: logger })
// all requests and responses will be formatted by my code
// GET /cities/_all_docs { limit: 5 }
// OK 200 468
```

## Tutorials, examples in the wild & screencasts

* article: [nano - a minimalistic CouchDB client for nodejs](https://writings.nunojob.com/2011/08/nano-minimalistic-couchdb-client-for-nodejs.html)
* article: [getting started with Node.js and CouchDB](https://writings.nunojob.com/2011/09/getting-started-with-nodejs-and-couchdb.html)
* article: [nano 3](https://writings.nunojob.com/2012/05/Nano-3.html)
* article: [how to update a document with nano](https://writings.nunojob.com/2012/07/How-To-Update-A-Document-With-Nano-The-CouchDB-Client-for-Node.js.html)
* article: [thoughts on development using CouchDB with Node.js](https://tbranyen.com/post/thoughts-on-development-using-couchdb-with-nodejs)
* example in the wild: [nanoblog](https://github.com/grabbeh/nanoblog)

## Roadmap

Check [issues][2]

## Tests

To run (and configure) the test suite simply:

``` sh
cd nano
npm install
npm run test
```

## Meta

* code: `git clone git://github.com/apache/couchdb-nano.git`
* home: <https://github.com/apache/couchdb-nano>
* bugs: <https://github.com/apache/couchdb-nano/issues>
* chat: [Freenode IRC @ #couchdb-dev][8]

[1]: https://npmjs.org
[2]: https://github.com/apache/couchdb-nano/issues
[4]: https://github.com/apache/couchdb-nano/blob/main/cfg/couch.example.js
[8]: https://webchat.freenode.net?channels=%23couchdb-dev
[axios]:  https://github.com/axios/axios

https://freenode.org/

## Release

To create a new release of nano. Run the following commands on the main branch

```sh
  npm version {patch|minor|major}
  github push  origin main --tags
  npm publish
```
