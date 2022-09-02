"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudAccount = exports.account = void 0;
const types_1 = require("@budibase/types");
const uuid_1 = require("uuid");
const backend_core_1 = require("@budibase/backend-core");
const account = () => {
    return {
        email: `${(0, uuid_1.v4)()}@test.com`,
        tenantId: backend_core_1.utils.newid(),
        hosting: types_1.Hosting.SELF,
        authType: types_1.AuthType.SSO,
        accountId: (0, uuid_1.v4)(),
        createdAt: Date.now(),
        verified: true,
        verificationSent: true,
        tier: "FREE",
    };
};
exports.account = account;
const cloudAccount = () => {
    return Object.assign(Object.assign({}, (0, exports.account)()), { budibaseUserId: (0, uuid_1.v4)() });
};
exports.cloudAccount = cloudAccount;
