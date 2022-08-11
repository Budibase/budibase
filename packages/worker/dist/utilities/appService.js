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
const fetch = require("node-fetch");
const { Headers } = require("@budibase/backend-core/constants");
const { getTenantId, isTenantIdSet } = require("@budibase/backend-core/tenancy");
const { checkSlashesInUrl } = require("../utilities");
const env = require("../environment");
function makeAppRequest(url, method, body) {
    return __awaiter(this, void 0, void 0, function* () {
        if (env.isTest()) {
            return;
        }
        const request = { headers: {} };
        request.headers[Headers.API_KEY] = env.INTERNAL_API_KEY;
        if (isTenantIdSet()) {
            request.headers[Headers.TENANT_ID] = getTenantId();
        }
        if (body) {
            request.headers["Content-Type"] = "application/json";
            request.body = JSON.stringify(body);
        }
        request.method = method;
        return fetch(checkSlashesInUrl(env.APPS_URL + url), request);
    });
}
exports.syncUserInApps = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield makeAppRequest(`/api/users/metadata/sync/${userId}`, "POST", {});
    if (response && response.status !== 200) {
        throw "Unable to sync user.";
    }
});
