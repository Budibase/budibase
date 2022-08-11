var level = require('level')
var concat = require('.')

level('DB', function (err, db) {
  if (err) throw err
  db.put('foo', 'bar', function (err) {
    if (err) throw err
    concat(db.iterator(), function (err, data) {
      if (err) throw err
      console.log(data)
    })
  })
})
