module.exports = function (iterator, cb) {
  var data = []
  var next = function () {
    iterator.next(function (err, key, value) {
      if (err || (key === undefined && value === undefined)) {
        return iterator.end(function (err2) {
          cb(err || err2, data)
        })
      }
      data.push({ key: key, value: value })
      next()
    })
  }
  next()
}
