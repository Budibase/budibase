const nano = require("nano")

const COUCH_DB_URL =
  process.env.COUCH_DB_URL || "http://admin:password@localhost:5984"

module.exports = nano(COUCH_DB_URL)
