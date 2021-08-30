const jwt = require("./passport/jwt")
const local = require("./passport/local")
const google = require("./passport/google")
const wechat = require("./passport/wechat")
const oidc = require("./passport/oidc")
const authenticated = require("./authenticated")
const auditLog = require("./auditLog")
const tenancy = require("./tenancy")

module.exports = {
  google,
  wechat,
  oidc,
  jwt,
  local,
  authenticated,
  auditLog,
  tenancy,
}
