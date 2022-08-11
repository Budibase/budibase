pouchdb-adapter-memory
======

PouchDB adapter using in-memory as its data store. Designed to run in either Node or the browser. Its adapter name is `'memory'`.

### Usage

```bash
npm install pouchdb-adapter-memory
```

```js
PouchDB.plugin(require('pouchdb-adapter-memory'));
var db = new PouchDB('mydb', {adapter: 'memory'});
```

For full API documentation and guides on PouchDB, see [PouchDB.com](http://pouchdb.com/). For details on PouchDB sub-packages, see the [Custom Builds documentation](http://pouchdb.com/custom.html).

### Source

PouchDB and its sub-packages are distributed as a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md).

For a full list of packages, see [the GitHub source](https://github.com/pouchdb/pouchdb/tree/master/packages).


