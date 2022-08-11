var common = require('./common')

function suite (options) {
  var testCommon = common(options)
  var test = testCommon.test

  require('./factory-test')(test, testCommon)
  require('./manifest-test')(test, testCommon)

  require('./leveldown-test')(test, testCommon)
  require('./open-test').all(test, testCommon)
  require('./close-test').all(test, testCommon)

  if (testCommon.createIfMissing) {
    require('./open-create-if-missing-test').all(test, testCommon)
  }

  if (testCommon.errorIfExists) {
    require('./open-error-if-exists-test').all(test, testCommon)
  }

  require('./put-test').all(test, testCommon)
  require('./get-test').all(test, testCommon)
  require('./del-test').all(test, testCommon)
  require('./put-get-del-test').all(test, testCommon)

  require('./batch-test').all(test, testCommon)
  require('./chained-batch-test').all(test, testCommon)

  require('./iterator-test').all(test, testCommon)
  require('./iterator-range-test').all(test, testCommon)

  if (testCommon.seek) {
    require('./iterator-seek-test').all(test, testCommon)
  }

  if (testCommon.snapshots) {
    require('./iterator-snapshot-test').all(test, testCommon)
  } else {
    require('./iterator-no-snapshot-test').all(test, testCommon)
  }

  if (testCommon.clear) {
    require('./clear-test').all(test, testCommon)
    require('./clear-range-test').all(test, testCommon)
  }
}

suite.common = common
module.exports = suite
