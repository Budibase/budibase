const env = require("../environment")
const CouchDB = require("../db")
const { init } = require("@budibase/auth")

exports.threadSetup = () => {
  // when thread starts, make sure it is recorded
  env.setInThread()
  init(CouchDB)
}
