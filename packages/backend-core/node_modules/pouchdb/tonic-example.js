// see documentation for more detail: http://pouchdb.com/api.html

const PouchDB = require('pouchdb')
require('pouchdb/extras/memory') /* this is used here just for compatibility with Tonic.
                                    you can omit this line and the {adapter: 'memory'}
                                    in the next, then your databases will be saved to disk or
                                    browser storage.
                                  */
// create a database (here with memory storage):
const db = new PouchDB('test', {adapter: 'memory'})

// create a new doc with an _id of 'mydoc':
let response = await db.put({
  _id: 'mydoc',
  title: 'Heroes'
})

// update an existing doc using _rev
await db.put({
  _id: 'mydoc',
  _rev: response.rev,
  title: "Sound and Vision",
})

// later you can fetch your doc
console.log(await db.get('mydoc'))

// or add many more docs
response = await db.bulkDocs([
    {_id: 'myotherdoc', title: 'The Magisters', type: "fake band"},
    {_id: 'another', title: 'Kowabunga', type: "fake band"},
    {title: 'Without an _id', type: null}
])

console.log('bulkDocs response: ' + JSON.stringify(response, null, 2))

// and query them
await db.put({
  _id: '_design/fakebands',
  views: {
    fakebands: {
      map: (function (doc) {
        if (doc.type == "fake band") {
          emit(doc.title)
        }
      }).toString()
    }
  }
})
await db.query('fakebands', {include_docs: true})
