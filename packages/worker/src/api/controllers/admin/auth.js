const jwt = require("jsonwebtoken")
const CouchDB = require("../../../db")
const passport = require("@budibase/auth")

exports.authenticate = async (ctx, next) => {
  return passport.authenticate("local", async (err, user, info, status) => {
    // TODO: better
    if (err) {
      ctx.throw(err)
    }

    // await ctx.login(user)
    ctx.body = {
      err,
      user,
      info,
      status,
    }
  })(ctx, next)
}
