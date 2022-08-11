import google = require("./passport/google");
import oidc = require("./passport/oidc");
import jwt = require("./passport/jwt");
import local = require("./passport/local");
import authenticated = require("./authenticated");
import auditLog = require("./auditLog");
import tenancy = require("./tenancy");
import { authError } from "./passport/utils";
import internalApi = require("./internalApi");
import { ssoCallbackUrl } from "./passport/utils";
import datasourceGoogle = require("./passport/datasource/google");
import csrf = require("./csrf");
import adminOnly = require("./adminOnly");
import builderOnly = require("./builderOnly");
import builderOrAdmin = require("./builderOrAdmin");
import joiValidator = require("./joi-validator");
export declare namespace datasource {
    export { datasourceGoogle as google };
}
export { google, oidc, jwt, local, authenticated, auditLog, tenancy, authError, internalApi, ssoCallbackUrl, csrf, adminOnly, builderOnly, builderOrAdmin, joiValidator };
