const env = require("../environment")
const CouchDB = require("../db")
const { init } = require("@budibase/auth")

exports.threadSetup = () => {
  // don't run this if not threading
  if (env.isTest() || env.DISABLE_THREADING) {
    return
  }
  // when thread starts, make sure it is recorded
  env.setInThread()
  init(CouchDB)
}
