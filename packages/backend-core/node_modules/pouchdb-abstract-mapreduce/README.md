pouchdb-abstract-mapreduce ![semver non-compliant](https://img.shields.io/badge/semver-non--compliant-red.svg)
======

PouchDB's secondary index API as an abstract module

### Usage

```bash
npm install --save-exact pouchdb-abstract-mapreduce
```

```js
var createAbstractMapreduce = require('pouchdb-abstract-mapreduce');

var abstract = createAbstractMapreduce(
  localDoc,
  mapper,
  reducer,
  ddocValidator);
```

The `createAbstractMapreduce` function returns an "abstract" mapreduce object of the form:

```js
{
  query: queryFun,
  viewCleanup: viewCleanupFun
}
```

Arguments are:

```
localDoc: string
  This is for the local doc that gets saved in order to track the
  "dependent" DBs and clean them up for viewCleanup. It should be
  unique, so that indexer plugins don't collide with each other.
mapper: function (mapFunDef, emit)
  Returns a map function based on the mapFunDef, which in the case of
  normal map/reduce is just the de-stringified function, but may be
  something else, such as an object in the case of pouchdb-find.
reducer: function (reduceFunDef)
  Ditto, but for reducing. Modules don't have to support reducing
  (e.g. pouchdb-find).
ddocValidator: function (ddoc, viewName)
  Throws an error if the ddoc or viewName is not valid.
  This could be a way to communicate to the user that the configuration for the
  indexer is invalid.
```

For full API documentation and guides on PouchDB, see [PouchDB.com](http://pouchdb.com/). For details on PouchDB sub-packages, see the [Custom Builds documentation](http://pouchdb.com/custom.html).

### Warning: semver-free zone!

This package is conceptually an internal API used by PouchDB or its plugins. It does not follow semantic versioning (semver), and rather its version is pegged to PouchDB's. Use exact versions when installing, e.g. with `--save-exact`.

### Source

PouchDB and its sub-packages are distributed as a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md).

For a full list of packages, see [the GitHub source](https://github.com/pouchdb/pouchdb/tree/master/packages).


