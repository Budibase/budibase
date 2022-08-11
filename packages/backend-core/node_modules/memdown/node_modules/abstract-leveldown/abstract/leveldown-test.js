module.exports.args = function (leveldown, test) {
  test('test database creation no-arg throws', function (t) {
    t.throws(
        leveldown
      , { name: 'Error', message: 'constructor requires at least a location argument' }
      , 'no-arg leveldown() throws'
    )
    t.end()
  })
  test('test database creation non-string location throws', function (t) {
    t.throws(
        function () {
          leveldown({})
        }
      , { name: 'Error', message: 'constructor requires a location string argument' }
      , 'non-string location leveldown() throws'
    )
    t.end()
  })

  test('test database open no-arg throws', function (t) {
    var db = leveldown('foo')
    t.ok(db, 'database object returned')
    t.ok(typeof db.open === 'function', 'open() function exists')
    t.end()
  })
}