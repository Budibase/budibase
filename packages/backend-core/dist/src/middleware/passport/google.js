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
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const { ssoCallbackUrl } = require("./utils");
const { authenticateThirdParty } = require("./third-party-common");
const { Configs } = require("../../../constants");
const buildVerifyFn = saveUserFn => {
    return (accessToken, refreshToken, profile, done) => {
        const thirdPartyUser = {
            provider: profile.provider,
            providerType: "google",
            userId: profile.id,
            profile: profile,
            email: profile._json.email,
            oauth2: {
                accessToken,
                refreshToken,
            },
        };
        return authenticateThirdParty(thirdPartyUser, true, // require local accounts to exist
        done, saveUserFn);
    };
};
/**
 * Create an instance of the google passport strategy. This wrapper fetches the configuration
 * from couchDB rather than environment variables, using this factory is necessary for dynamically configuring passport.
 * @returns Dynamically configured Passport Google Strategy
 */
exports.strategyFactory = function (config, callbackUrl, saveUserFn) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { clientID, clientSecret } = config;
            if (!clientID || !clientSecret) {
                throw new Error("Configuration invalid. Must contain google clientID and clientSecret");
            }
            const verify = buildVerifyFn(saveUserFn);
            return new GoogleStrategy({
                clientID: config.clientID,
                clientSecret: config.clientSecret,
                callbackURL: callbackUrl,
            }, verify);
        }
        catch (err) {
            console.error(err);
            throw new Error(`Error constructing google authentication strategy: ${err}`, err);
        }
    });
};
exports.getCallbackUrl = function (db, config) {
    return __awaiter(this, void 0, void 0, function* () {
        return ssoCallbackUrl(db, config, Configs.GOOGLE);
    });
};
// expose for testing
exports.buildVerifyFn = buildVerifyFn;
//# sourceMappingURL=google.js.map