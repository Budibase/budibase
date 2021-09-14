const app = require("./app")
const cron = require("./cron")
const rowDeleted = require("./rowDeleted")
const rowSaved = require("./rowSaved")
const rowUpdated = require("./rowUpdated")
const webhook = require("./webhook")

exports.definitions = {
  ROW_SAVED: rowSaved.definition,
  ROW_UPDATED: rowUpdated.definition,
  ROW_DELETED: rowDeleted.definition,
  WEBHOOK: webhook.definition,
  APP: app.definition,
  CRON: cron.definition,
}
