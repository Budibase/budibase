import * as jwt from "./passport/jwt"
import * as local from "./passport/local"
import * as google from "./passport/google"
import * as oidc from "./passport/oidc"
import { authError, ssoCallbackUrl } from "./passport/utils"
import authenticated from "./authenticated"
import auditLog from "./auditLog"
import tenancy from "./tenancy"
import internalApi from "./internalApi"
import * as datasourceGoogle from "./passport/datasource/google"
import csrf from "./csrf"
import adminOnly from "./adminOnly"
import builderOrAdmin from "./builderOrAdmin"
import builderOnly from "./builderOnly"
import * as joiValidator from "./joi-validator"

const pkg = {
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
  builderOnly,
  builderOrAdmin,
  joiValidator,
}

export = pkg
