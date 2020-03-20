const authenticate = require("./authenticate")
const setPasswordFromTemporaryCode = require("./setPasswordFromTemporaryCode")
const createTemporaryAccess = require("./createTemporaryAccess")
const appDefault = require("./appDefault")
const changeMyPassword = require("./changeMyPassword")
const executeAction = require("./executeAction")
const createUser = require("./createUser")
const enableUser = require("./enableUser")
const disableUser = require("./disableUser")
const getUsers = require("./getUsers")
const getAccessLevels = require("./getAccessLevels")
const listRecordsGet = require("./listRecordsGet")
const listRecordsPost = require("./listRecordsPost")
const aggregatesPost = require("./aggregatesPost")
const postFiles = require("./postFiles")
const saveRecord = require("./saveRecord")
const lookupField = require("./lookupField")
const getRecord = require("./getRecord")
const deleteRecord = require("./deleteRecord")
const saveAppHierarchy = require("./saveAppHierarchy")
const upgradeData = require("./saveAppHierarchy")

module.exports = {
  authenticate,
  setPasswordFromTemporaryCode,
  createTemporaryAccess,
  appDefault,
  changeMyPassword,
  executeAction,
  createUser,
  enableUser,
  disableUser,
  getUsers,
  getAccessLevels,
  listRecordsGet,
  listRecordsPost,
  aggregatesPost,
  postFiles,
  saveRecord,
  lookupField,
  getRecord,
  deleteRecord,
  saveAppHierarchy,
  upgradeData,
}
