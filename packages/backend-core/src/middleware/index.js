const jwt = require("./passport/jwt")
const local = require("./passport/local")
const google = require("./passport/google")
const oidc = require("./passport/oidc")
const { authError, ssoCallbackUrl } = require("./passport/utils")
const authenticated = require("./authenticated")
const auditLog = require("./auditLog")
const tenancy = require("./tenancy")
const internalApi = require("./internalApi")
const datasourceGoogle = require("./passport/datasource/google")
const csrf = require("./csrf")
const adminOnly = require("./adminOnly")
const joiValidator = require("./joi-validator")
module.exports = {
  google,
  oidc,
  jwt,
  local,
  authenticated,
  auditLog,
  tenancy,
  authError,
  internalApi,
  ssoCallbackUrl,
  datasource: {
    google: datasourceGoogle,
  },
  csrf,
  adminOnly,
  joiValidator,
}
