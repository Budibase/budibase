const jwt = require("./passport/jwt")
const local = require("./passport/local")
const google = require("./passport/google")

module.exports = {
  google,
  jwt,
  local,
}
