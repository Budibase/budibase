"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwt = require("jsonwebtoken");
const { UserStatus } = require("../../constants");
const { compare } = require("../../hashing");
const env = require("../../environment");
const users = require("../../users");
const { authError } = require("./utils");
const { newid } = require("../../hashing");
const { createASession } = require("../../security/sessions");
const { getTenantId } = require("../../tenancy");
const INVALID_ERR = "Invalid credentials";
const SSO_NO_PASSWORD = "SSO user does not have a password set";
const EXPIRED = "This account has expired. Please reset your password";
exports.options = {
    passReqToCallback: true,
};
/**
 * Passport Local Authentication Middleware.
 * @param {*} ctx the request structure
 * @param {*} email username to login with
 * @param {*} password plain text password to log in with
 * @param {*} done callback from passport to return user information and errors
 * @returns The authenticated user, or errors if they occur
 */
exports.authenticate = function (ctx, email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email)
            return authError(done, "Email Required");
        if (!password)
            return authError(done, "Password Required");
        const dbUser = yield users.getGlobalUserByEmail(email);
        if (dbUser == null) {
            return authError(done, `User not found: [${email}]`);
        }
        // check that the user is currently inactive, if this is the case throw invalid
        if (dbUser.status === UserStatus.INACTIVE) {
            return authError(done, INVALID_ERR);
        }
        // check that the user has a stored password before proceeding
        if (!dbUser.password) {
            if ((dbUser.account && dbUser.account.authType === "sso") || // root account sso
                dbUser.thirdPartyProfile // internal sso
            ) {
                return authError(done, SSO_NO_PASSWORD);
            }
            console.error("Non SSO usser has no password set", dbUser);
            return authError(done, EXPIRED);
        }
        // authenticate
        if (yield compare(password, dbUser.password)) {
            const sessionId = newid();
            const tenantId = getTenantId();
            yield createASession(dbUser._id, { sessionId, tenantId });
            dbUser.token = jwt.sign({
                userId: dbUser._id,
                sessionId,
                tenantId,
            }, env.JWT_SECRET);
            // Remove users password in payload
            delete dbUser.password;
            return done(null, dbUser);
        }
        else {
            return authError(done, INVALID_ERR);
        }
    });
};
//# sourceMappingURL=local.js.map