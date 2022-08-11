PouchDB Find [![Build Status](https://travis-ci.org/nolanlawson/pouchdb-find.svg)](https://travis-ci.org/nolanlawson/pouchdb-find) [![Coverage Status](https://coveralls.io/repos/nolanlawson/pouchdb-find/badge.svg?branch=master&service=github)](https://coveralls.io/github/nolanlawson/pouchdb-find?branch=master)
=====

([Live demo](http://nolanlawson.github.io/pouchdb-find/))

Provides a simple, [MongoDB-inspired](https://github.com/cloudant/mango) query language that accomplishes the same thing as the [map/reduce API](http://pouchdb.com/api.html#query_database), but with far less code.

Eventually this will replace PouchDB's map/reduce API entirely. You'll still be able to use map/reduce, but it will be distributed as a separate plugin.

**Warning: this is beta software! It may change at anytime and could be unstable.**

Status
---

Implemented: `$lt`, `$gt`, `$lte`, `$gte`, `$eq`, `$exists`, `$type`, `$in`, `$nin`, `$all`, `$size`, `$or`, `$nor`, `$not`, `$mod`, `$regex`, `$elemMatch`, multi-field queries, multi-field indexes, multi-field sort, `'deep.fields.like.this'`, ascending and descending sort.

Not implemented: `partial_filter_selector` in non-remote databases, as used for [partial indexes](http://docs.couchdb.org/en/stable/api/database/find.html#find-partial-indexes).

**0.2.0**: `$and`, `$ne`

**0.3.0**: `limit`, `skip`, `ddoc` when creating an index

**0.4.0**: `total_rows`

**0.5.0**: `$in`, `$nin`, `$all`, `$size`

**0.6.0**: `$or`, `$nor`, `$not`

**0.7.0**: `$elemMatch`, `$regex`

**0.8.0**: Bug fixes for $and, $type, $exists

**0.9.0**: Bug fixes for `$elemMatch`. Rewrite of in-memory operator

**0.10.0**: Update for latest Mango spec (warnings instead of errors), update for PouchDB 5.4.0.

Usage
------

#### In the browser

To use this plugin in the browser, include it after `pouchdb.js` in your HTML page:

```html
<script src="pouchdb.js"></script>
<script src="pouchdb.find.js"></script>
```

You can also download it from Bower:

```
bower install pouchdb-find
```

#### In Node.js/Browserify

Or to use it in Node.js, just npm install it:

```
npm install pouchdb-find
```

And then attach it to the `PouchDB` object:

```js
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
```

API
-----

This API is modeled after [the Cloudant query API](https://docs.cloudant.com/api/cloudant-query.html), merged into CouchDB 2.0. Read that page for more details.

As with PouchDB, the entire API accepts either the callback or the Promise style.

**Overview**

* [`db.createIndex(index [, callback])`](#dbcreateindexindex--callback)
* [`db.getIndexes([callback])`](#dbgetindexescallback)
* [`db.deleteIndex(index [, callback])`](#dbdeleteindexindex--callback)
* [`db.find(request [, callback])`](#dbfindrequest--callback)

### db.createIndex(index [, callback])

Create an index if it doesn't exist, or do nothing if it already exists.

Example:

```js
db.createIndex({
  index: {
    fields: ['foo']
  }
}).then(function (result) {
  // yo, a result
}).catch(function (err) {
  // ouch, an error
});
```

The result can be either:

```js
{"result": "created"} // index was created
```

or:

```js
{"result": "exists"} // index already exists
```

You can also create an index on multiple fields:

```js
db.createIndex({
  index: {
    fields: ['foo', 'bar', 'baz']
  }
});
```

Or an index on deep fields:

```js
db.createIndex({
  index: {
    fields: ['person.address.zipcode']
  }
});
```

You can also specify additional options, if you want more control over how your index is created:

```js
db.createIndex({
  index: {
    fields: ['foo', 'bar'],
    name: 'myindex',
    ddoc: 'mydesigndoc'
    type: 'json',
  }
});
```

**Options**

* `fields` is a list of fields to index
* `name` (optional) name of the index, auto-generated if you don't include it
* `ddoc` (optional) design document name (i.e. the part after `'_design/'`, auto-generated if you don't include it
* `type` (optional) only supports `'json'`, and it's also the default

### db.getIndexes([callback])

Get a list of all the indexes you've created. Also tells you about the special `_all_docs` index, i.e. the default index on the `_id` field.

Example:

```js
db.getIndexes().then(function (result) {
  // yo, a result
}).catch(function (err) {
  // ouch, an error
});
```

Example result:

```js
{
  "indexes": [
    {
      "ddoc": null,
      "name": "_all_docs",
      "type": "special",
      "def": {
        "fields": [
          {
            "_id": "asc"
          }
        ]
      }
    },
    {
      "ddoc": "_design/idx-0f3a6f73110868266fa5c688caf8acd3",
      "name": "idx-0f3a6f73110868266fa5c688caf8acd3",
      "type": "json",
      "def": {
        "fields": [
          {
            "foo": "asc"
          },
          {
            "bar": "asc"
          }
        ]
      }
    }
  ]
}
```

### db.deleteIndex(index [, callback])

Delete an index and clean up any leftover data on the disk.

**Options**

* `index` Definition of an index to delete. You can pass it in exactly as you received it from the `getIndexes()` API. You cannot delete the built-in `_all_docs` index.

Example:

```js
db.deleteIndex({
  "ddoc": "_design/idx-0f3a6f73110868266fa5c688caf8acd3",
  "name": "idx-0f3a6f73110868266fa5c688caf8acd3",
  "type": "json",
  "def": {
    "fields": [
      {
        "foo": "asc"
      },
      {
        "bar": "asc"
      }
    ]
  }
}).then(function (result) {
  // yo, a result
}).catch(function (err) {
  // ouch, an error
});
```

Notice that you don't need to provide a `_rev`! The design doc is also deleted.

### db.find(request [, callback])

Query the API to find some documents.

Example:


```js
db.find({
  selector: {name: 'Mario'},
  fields: ['_id', 'name'],
  sort: ['name']
}).then(function (result) {
  // yo, a result
}).catch(function (err) {
  // ouch, an error
});
```

Example result:

```js
{
  "docs": [
    {
      "_id": "mario",
      "name": "Mario"
    }
  ]
}
```

**Options**;

* `selector` Defines a selector to filter the results. Required.
  * `$lt` Match fields "less than" this one.
  * `$gt` Match fields "greater than" this one.
  * `$lte` Match fields "less than or equal to" this one.
  * `$gte` Match fields "greater than or equal to" this one.
  * `$eq` Match fields equal to this one.
  * `$ne` Match fields not equal to this one.
  * `$exists` True if the field should exist, false otherwise.
  * `$type` One of: "null", "boolean", "number", "string", "array", or "object".
  * `$in` Matches if all the selectors in the array match.
  * `$and` Matches if all the selectors in the array match.
  * `$nin` The document field must not exist in the list provided.
  * `$all` Matches an array value if it contains all the elements of the argument array.
  * `$size` Special condition to match the length of an array field in a document.
  * `$or` Matches if any of the selectors in the array match. All selectors must use the same index.
  * `$nor` Matches if none of the selectors in the array match.
  * `$not` Matches if the given selector does not match.
  * `$mod` Matches documents where (field % Divisor == Remainder) is true, and only when the document field is an integer.
  * `$regex` A regular expression pattern to match against the document field.
  * `$elemMatch` Matches all documents that contain an array field with at least one element that matches all the specified query criteria.

* `fields` (Optional) Defines a list of fields that you want to receive. If omitted, you get the full documents.
* `sort` (Optional) Defines a list of fields defining how you want to sort. Note that sorted fields also have to be selected in the `selector`.
* `limit` (Optional) Maximum number of documents to return.
* `skip` (Optional) Number of docs to skip before returning.

If there's no index that matches your `selector`/`sort`, then this method will issue a warning.

The best index will be chosen automatically. If you want to see the query plan for your query, then turn on [debugging](#debugging).

See [the Cloudant docs](https://docs.cloudant.com/api.html#cloudant-query) for more details.

Examples
----

### Equals

Find all docs where `doc.name === 'Mario'`:

```js
db.find({
  selector: {name: {$eq: 'Mario'}}
});
```

This is equivalent to:

```js
db.find({
  selector: {name: 'Mario'}
});
```

### Multi-selectors

Find all docs where `doc.series === 'Mario'` and `doc.debut > 1990`:

```js
db.find({
  selector: {
    series: 'Mario',
    debut: { $gt: 1990 }
  }
});
```

This is equivalent to:

```js
db.find({
  selector: {
    $and: [
      { series: 'Mario' },
      { debut: { $gt: 1990 } }
    ]
  }
});
```

### Sorting

Return all docs sorted by `doc.debut` descending:

```js
db.find({
  selector: {
    debut: {'$exists': true}
  },
  sort: [{debut: 'desc'}]
});
```

For more examples, refer to [Cloudant's `_find` documentation](https://docs.cloudant.com/api.html#finding-documents-using-an-index).


With a remote database
----

Over HTTP, this plugin currently works with Cloudant and CouchDB 2.0. Cloudant is the reference implementation, so the API should be the same.

PouchDB Server also has this API, since it includes this very plugin by default.

Debugging
----

Just call:

```js
PouchDB.debug.enable('pouchdb:find')
```

Then `pouchdb-find` will start logging some debug information to the console. This can be useful if, for instance, you want to see the query plan that is being used to execute your queries.

Kudos
---

Thanks very much to [@garrensmith](https://github.com/garrensmith) for implementing all the new features from 0.4.0 to 0.6.0!

How to contribute to this thing
----------

Instructions are in [CONTRIBUTING.md](https://github.com/nolanlawson/pouchdb-find/blob/master/CONTRIBUTING.md).
