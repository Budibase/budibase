const passport = require("koa-passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const GoogleStrategy = require("passport-google-oauth").Strategy
const jwt = require("./jwt")
const local = require("./local")
const google = require("./google")

// Strategies
passport.use(new LocalStrategy(local.options, local.authenticate))
passport.use(new JwtStrategy(jwt.options, jwt.authenticate))
// passport.use(new GoogleStrategy(google.options, google.authenticate))

// exports.middleware = async (ctx, next) => {
//   if (ctx.isAuthenticated()) {
//     return next()
//   } else {
//     ctx.throw(403, "Not Authenticated")
//   }
// }
