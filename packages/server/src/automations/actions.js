const sendgridEmail = require("./steps/sendgridEmail")
const sendSmtpEmail = require("./steps/sendSmtpEmail")
const createRow = require("./steps/createRow")
const updateRow = require("./steps/updateRow")
const deleteRow = require("./steps/deleteRow")
const executeScript = require("./steps/executeScript")
const bash = require("./steps/bash")
const executeQuery = require("./steps/executeQuery")
const outgoingWebhook = require("./steps/outgoingWebhook")
const serverLog = require("./steps/serverLog")
const discord = require("./steps/discord")
// TODO: remove zapier/integromat some time in the future/deprecate them
const zapier = require("./steps/zapier")
const integromat = require("./steps/integromat")

const BUILTIN_ACTIONS = {
  SEND_EMAIL: sendgridEmail.run,
  SEND_EMAIL_SMTP: sendSmtpEmail.run,
  CREATE_ROW: createRow.run,
  UPDATE_ROW: updateRow.run,
  DELETE_ROW: deleteRow.run,
  OUTGOING_WEBHOOK: outgoingWebhook.run,
  EXECUTE_SCRIPT: executeScript.run,
  EXECUTE_BASH: bash.run,
  EXECUTE_QUERY: executeQuery.run,
  SERVER_LOG: serverLog.run,
  // these used to be lowercase step IDs, maintain for backwards compat
  discord: discord.run,
  zapier: zapier.run,
  integromat: integromat.run,
}
const BUILTIN_DEFINITIONS = {
  SEND_EMAIL: sendgridEmail.definition,
  SEND_EMAIL_SMTP: sendSmtpEmail.definition,
  CREATE_ROW: createRow.definition,
  UPDATE_ROW: updateRow.definition,
  DELETE_ROW: deleteRow.definition,
  OUTGOING_WEBHOOK: outgoingWebhook.definition,
  EXECUTE_SCRIPT: executeScript.definition,
  EXECUTE_QUERY: executeQuery.definition,
  EXECUTE_BASH: bash.definition,
  SERVER_LOG: serverLog.definition,
  // these used to be lowercase step IDs, maintain for backwards compat
  discord: discord.definition,
  zapier: zapier.definition,
  integromat: integromat.definition,
}

/* istanbul ignore next */
module.exports.getAction = async function (actionName) {
  if (BUILTIN_ACTIONS[actionName] != null) {
    return BUILTIN_ACTIONS[actionName]
  }
}

// definitions will have downloaded ones added to it, while builtin won't
module.exports.DEFINITIONS = BUILTIN_DEFINITIONS
module.exports.BUILTIN_DEFINITIONS = BUILTIN_DEFINITIONS
