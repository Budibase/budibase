const application = require("./application")
const row = require("./row")
const table = require("./table")
const query = require("./query")
const user = require("./user")
const misc = require("./misc")

exports.examples = {
  ...application.getExamples(),
  ...row.getExamples(),
  ...table.getExamples(),
  ...query.getExamples(),
  ...user.getExamples(),
  ...misc.getExamples(),
}

exports.schemas = {
  ...application.getSchemas(),
  ...row.getSchemas(),
  ...table.getSchemas(),
  ...query.getSchemas(),
  ...user.getSchemas(),
  ...misc.getSchemas(),
}
