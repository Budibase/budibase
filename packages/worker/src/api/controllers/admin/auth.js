const jwt = require("jsonwebtoken")
const CouchDB = require("../../../db")
const passport = require("koa-passport")

exports.authenticate = async (ctx, next) => {
  return passport.authenticate("local", (err, user, info, status) => {
    ctx.body = {
      err,
      user,
      info,
      status,
    }
  })(ctx, next)
}
