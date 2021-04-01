const jwt = require("passport-jwt")
const env = require("../../environment")
const { getCookieName } = require("../../../../server/src/utilities")

const ExtractJWT = jwt.ExtractJwt

exports.options = {
  jwtFromRequest: function(ctx) {
    return ctx.cookies.get("budibase")
  },
  // TODO: fix
  secretOrKey: env.JWT_SECRET || "funky",
}

exports.authenticate = async function(jwt, done) {
  console.log(jwt)
  done({ name: "joe" })
  // const appId = ctx.appId
  // if (!appId) ctx.throw(400, "No appId")

  // const { email, password } = ctx.request.body

  // if (!email) ctx.throw(400, "Email Required.")
  // if (!password) ctx.throw(400, "Password Required.")

  // // Check the user exists in the instance DB by email
  // const db = new CouchDB(appId)
  // const app = await db.get(appId)

  // let dbUser
  // try {
  //   dbUser = await db.get(generateUserID(email))
  // } catch (_) {
  //   // do not want to throw a 404 - as this could be
  //   // used to determine valid emails
  //   ctx.throw(401, INVALID_ERR)
  // }
}
