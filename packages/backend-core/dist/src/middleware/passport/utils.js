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
const { isMultiTenant, getTenantId } = require("../../tenancy");
const { getScopedConfig } = require("../../db/utils");
const { Configs } = require("../../constants");
/**
 * Utility to handle authentication errors.
 *
 * @param {*} done The passport callback.
 * @param {*} message Message that will be returned in the response body
 * @param {*} err (Optional) error that will be logged
 */
exports.authError = function (done, message, err = null) {
    return done(err, null, // never return a user
    { message: message });
};
exports.ssoCallbackUrl = (db, config, type) => __awaiter(void 0, void 0, void 0, function* () {
    // incase there is a callback URL from before
    if (config && config.callbackURL) {
        return config.callbackURL;
    }
    const publicConfig = yield getScopedConfig(db, {
        type: Configs.SETTINGS,
    });
    let callbackUrl = `/api/global/auth`;
    if (isMultiTenant()) {
        callbackUrl += `/${getTenantId()}`;
    }
    callbackUrl += `/${type}/callback`;
    return `${publicConfig.platformUrl}${callbackUrl}`;
});
//# sourceMappingURL=utils.js.map