const sendEmail = require("./steps/sendEmail")
const saveRecord = require("./steps/saveRecord")
const deleteRecord = require("./steps/deleteRecord")
const createUser = require("./steps/createUser")

const BUILTIN_ACTIONS = {
  SEND_EMAIL: sendEmail.run,
  SAVE_RECORD: saveRecord.run,
  DELETE_RECORD: deleteRecord.run,
  CREATE_USER: createUser.run,
}

const BUILTIN_DEFINITIONS = {
  SEND_EMAIL: sendEmail.definition,
  SAVE_RECORD: saveRecord.definition,
  DELETE_RECORD: deleteRecord.definition,
  CREATE_USER: createUser.definition,
}

module.exports.getAction = async function(actionName) {
  if (BUILTIN_ACTIONS[actionName] != null) {
    return BUILTIN_ACTIONS[actionName]
  }
  // TODO: load async actions here
}

module.exports.BUILTIN_DEFINITIONS = BUILTIN_DEFINITIONS
