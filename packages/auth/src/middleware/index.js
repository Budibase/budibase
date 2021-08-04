const jwt = require("./passport/jwt")
const local = require("./passport/local")
const google = require("./passport/google")
const oidc = require("./passport/oidc")
const authenticated = require("./authenticated")
const auditLog = require("./auditLog")

module.exports = {
  google,
  oidc,
  jwt,
  local,
  authenticated,
  auditLog,
}
