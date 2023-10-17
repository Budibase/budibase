pouchdb-adapter-leveldb-core ![semver non-compliant](https://img.shields.io/badge/semver-non--compliant-red.svg)
======

Underlying adapter code for LevelDOWN-based PouchDB adapters (such as `pouchdb-adapter-leveldb`). Most likely you should not use this package unless you are trying to build your own PouchDB adapter based on a *DOWN database.

### Usage

```bash
npm install --save-exact pouchdb-adapter-leveldb-core
```

### Overview

`pouchdb-adapter-leveldb-core` is designed in such a way that you can substitute
[any LevelDOWN-based implementation](https://github.com/rvagg/node-levelup/wiki/Modules#storage-back-ends) and therefore
use PouchDB over RiakDOWN, RedisDOWN, etc.

In practice, though, only a handful of LevelDOWN-based adapters are supported by PouchDB and guaranteed to run with 100%
fidelity. Furthermore, adapters like RiakDOWN, MySQLDown, RedisDOWN, etc. rarely provide the feature that fans of those
databases hope to get out of them, i.e. PouchDB's magical syncing capabilities on top of their favorite database. In truth,
what those adapters do is reduce the underlying database to a LevelDB-like key-value store and require PouchDB to implement
its own revision-handling on top of them. In other words, they tend to be unperformant and require you to exclusively use
PouchDB's API to access them.

Only certain adapters (e.g. in-memory, based on [MemDOWN](http://github.com/level/memdown)) are officially supported by the
PouchDB project; you are free to experiment with other datastores, but be forewarned of the above caveats. To see how to
build a custom LevelDOWN-based database, see the source code for `pouchdb-adapter-memory`, `pouchdb-adapter-localstorage`, or
`pouchdb-adapter-fruitdown`.

### Details

For full API documentation and guides on PouchDB, see [PouchDB.com](http://pouchdb.com/). For details on PouchDB sub-packages, see the [Custom Builds documentation](http://pouchdb.com/custom.html).

### Warning: semver-free zone!

This package is conceptually an internal API used by PouchDB or its plugins. It does not follow semantic versioning (semver), and rather its version is pegged to PouchDB's. Use exact versions when installing, e.g. with `--save-exact`.

### Source

PouchDB and its sub-packages are distributed as a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md).

For a full list of packages, see [the GitHub source](https://github.com/pouchdb/pouchdb/tree/master/packages).


