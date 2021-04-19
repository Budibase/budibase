const CouchDB = require("../../../db")
const {
  hash,
  generateUserID,
  getUserParams,
  StaticDatabases,
} = require("@budibase/auth")
const { UserStatus } = require("../../../constants")

const USER_DB = StaticDatabases.USER.name

exports.save = async function(ctx, next) {
  const db = new CouchDB(USER_DB)
}

exports.fetch = async function(ctx, next) {
  const db = new CouchDB(USER_DB)
}

exports.find = async function(ctx, next) {
  const db = new CouchDB(USER_DB)
}

exports.destroy = async function(ctx, next) {
  const db = new CouchDB(USER_DB)
}
