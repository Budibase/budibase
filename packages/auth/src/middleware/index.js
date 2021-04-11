const jwt = require("./passport/jwt")
const local = require("./passport/local")
const google = require("./passport/google")
const authenticated = require("./authenticated")

module.exports = {
  google,
  jwt,
  local,
  authenticated,
}
