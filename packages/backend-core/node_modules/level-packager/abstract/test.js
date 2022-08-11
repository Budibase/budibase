'use strict'

module.exports = function (test, level, options) {
  options = options || {}

  require('./base-test')(test, level)
  require('./db-values-test')(test, level, options.nonPersistent)

  if (!options.skipErrorIfExistsTest) {
    require('./error-if-exists-test')(test, level)
  }

  if (!options.skipRepairTest) {
    require('./repair-test')(test, level)
  }

  if (!options.skipDestroyTest) {
    require('./destroy-test')(test, level)
  }
}
