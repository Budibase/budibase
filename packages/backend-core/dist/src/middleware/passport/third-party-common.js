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
const env = require("../../environment");
const jwt = require("jsonwebtoken");
const { generateGlobalUserID } = require("../../db/utils");
const { authError } = require("./utils");
const { newid } = require("../../hashing");
const { createASession } = require("../../security/sessions");
const users = require("../../users");
const { getGlobalDB, getTenantId } = require("../../tenancy");
const fetch = require("node-fetch");
/**
 * Common authentication logic for third parties. e.g. OAuth, OIDC.
 */
exports.authenticateThirdParty = function (thirdPartyUser, requireLocalAccount = true, done, saveUserFn) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!saveUserFn) {
            throw new Error("Save user function must be provided");
        }
        if (!thirdPartyUser.provider) {
            return authError(done, "third party user provider required");
        }
        if (!thirdPartyUser.userId) {
            return authError(done, "third party user id required");
        }
        if (!thirdPartyUser.email) {
            return authError(done, "third party user email required");
        }
        // use the third party id
        const userId = generateGlobalUserID(thirdPartyUser.userId);
        const db = getGlobalDB();
        let dbUser;
        // try to load by id
        try {
            dbUser = yield db.get(userId);
        }
        catch (err) {
            // abort when not 404 error
            if (!err.status || err.status !== 404) {
                return authError(done, "Unexpected error when retrieving existing user", err);
            }
        }
        // fallback to loading by email
        if (!dbUser) {
            dbUser = yield users.getGlobalUserByEmail(thirdPartyUser.email);
        }
        // exit early if there is still no user and auto creation is disabled
        if (!dbUser && requireLocalAccount) {
            return authError(done, "Email does not yet exist. You must set up your local budibase account first.");
        }
        // first time creation
        if (!dbUser) {
            // setup a blank user using the third party id
            dbUser = {
                _id: userId,
                email: thirdPartyUser.email,
                roles: {},
            };
        }
        dbUser = yield syncUser(dbUser, thirdPartyUser);
        // never prompt for password reset
        dbUser.forceResetPassword = false;
        // create or sync the user
        try {
            yield saveUserFn(dbUser, false, false);
        }
        catch (err) {
            return authError(done, err);
        }
        // now that we're sure user exists, load them from the db
        dbUser = yield db.get(dbUser._id);
        // authenticate
        const sessionId = newid();
        const tenantId = getTenantId();
        yield createASession(dbUser._id, { sessionId, tenantId });
        dbUser.token = jwt.sign({
            userId: dbUser._id,
            sessionId,
        }, env.JWT_SECRET);
        return done(null, dbUser);
    });
};
function syncProfilePicture(user, thirdPartyUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const pictureUrl = thirdPartyUser.profile._json.picture;
        if (pictureUrl) {
            const response = yield fetch(pictureUrl);
            if (response.status === 200) {
                const type = response.headers.get("content-type");
                if (type.startsWith("image/")) {
                    user.pictureUrl = pictureUrl;
                }
            }
        }
        return user;
    });
}
/**
 * @returns a user that has been sync'd with third party information
 */
function syncUser(user, thirdPartyUser) {
    return __awaiter(this, void 0, void 0, function* () {
        // provider
        user.provider = thirdPartyUser.provider;
        user.providerType = thirdPartyUser.providerType;
        if (thirdPartyUser.profile) {
            const profile = thirdPartyUser.profile;
            if (profile.name) {
                const name = profile.name;
                // first name
                if (name.givenName) {
                    user.firstName = name.givenName;
                }
                // last name
                if (name.familyName) {
                    user.lastName = name.familyName;
                }
            }
            user = yield syncProfilePicture(user, thirdPartyUser);
            // profile
            user.thirdPartyProfile = Object.assign({}, profile._json);
        }
        // oauth tokens for future use
        if (thirdPartyUser.oauth2) {
            user.oauth2 = Object.assign({}, thirdPartyUser.oauth2);
        }
        return user;
    });
}
//# sourceMappingURL=third-party-common.js.map