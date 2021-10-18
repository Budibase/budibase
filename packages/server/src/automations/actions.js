const sendSmtpEmail = require("./steps/sendSmtpEmail")
const createRow = require("./steps/createRow")
const updateRow = require("./steps/updateRow")
const deleteRow = require("./steps/deleteRow")
const executeScript = require("./steps/executeScript")
const executeQuery = require("./steps/executeQuery")
const outgoingWebhook = require("./steps/outgoingWebhook")
const serverLog = require("./steps/serverLog")
const discord = require("./steps/discord")
const slack = require("./steps/slack")
const zapier = require("./steps/zapier")
const integromat = require("./steps/integromat")
let filter = require("./steps/filter")
let delay = require("./steps/delay")
let queryRow = require("./steps/queryRows")
const env = require("../environment")

const ACTION_IMPLS = {
  SEND_EMAIL_SMTP: sendSmtpEmail.run,
  CREATE_ROW: createRow.run,
  UPDATE_ROW: updateRow.run,
  DELETE_ROW: deleteRow.run,
  OUTGOING_WEBHOOK: outgoingWebhook.run,
  EXECUTE_SCRIPT: executeScript.run,
  EXECUTE_QUERY: executeQuery.run,
  SERVER_LOG: serverLog.run,
  DELAY: delay.run,
  FILTER: filter.run,
  QUERY_ROWS: queryRow.run,
  // these used to be lowercase step IDs, maintain for backwards compat
  discord: discord.run,
  slack: slack.run,
  zapier: zapier.run,
  integromat: integromat.run,
}
const ACTION_DEFINITIONS = {
  SEND_EMAIL_SMTP: sendSmtpEmail.definition,
  CREATE_ROW: createRow.definition,
  UPDATE_ROW: updateRow.definition,
  DELETE_ROW: deleteRow.definition,
  OUTGOING_WEBHOOK: outgoingWebhook.definition,
  EXECUTE_SCRIPT: executeScript.definition,
  EXECUTE_QUERY: executeQuery.definition,
  SERVER_LOG: serverLog.definition,
  DELAY: delay.definition,
  FILTER: filter.definition,
  QUERY_ROWS: queryRow.definition,
  // these used to be lowercase step IDs, maintain for backwards compat
  discord: discord.definition,
  slack: slack.definition,
  zapier: zapier.definition,
  integromat: integromat.definition,
}

// don't add the bash script/definitions unless in self host
// the fact this isn't included in any definitions means it cannot be
// ran at all
if (env.SELF_HOSTED) {
  const bash = require("./steps/bash")
  ACTION_IMPLS["EXECUTE_BASH"] = bash.run
  ACTION_DEFINITIONS["EXECUTE_BASH"] = bash.definition
}

/* istanbul ignore next */
exports.getAction = async function (actionName) {
  if (ACTION_IMPLS[actionName] != null) {
    return ACTION_IMPLS[actionName]
  }
}

exports.ACTION_DEFINITIONS = ACTION_DEFINITIONS
