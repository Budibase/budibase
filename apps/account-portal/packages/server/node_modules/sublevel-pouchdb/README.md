sublevel-pouchdb ![semver non-compliant](https://img.shields.io/badge/semver-non--compliant-red.svg)
======

Fork of [level-sublevel](https://github.com/dominictarr/level-sublevel) 
with ony the subset of the API that PouchDB uses. Forked from v6.5.4, 
commit [fa1b712](https://github.com/dominictarr/level-sublevel/commits/fa1b7121f9632b637e650cc1ec9b1723b60df864).

### Usage

```bash
npm install --save-exact sublevel-pouchdb
```

For full API documentation and guides on PouchDB, see [PouchDB.com](http://pouchdb.com/). For details on PouchDB sub-packages, see the [Custom Builds documentation](http://pouchdb.com/custom.html).


### Warning: semver-free zone!

This package is conceptually an internal API used by PouchDB or its plugins. It does not follow semantic versioning (semver), and rather its version is pegged to PouchDB's. Use exact versions when installing, e.g. with `--save-exact`.


### Source

PouchDB and its sub-packages are distributed as a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md).

For a full list of packages, see [the GitHub source](https://github.com/pouchdb/pouchdb/tree/master/packages).


