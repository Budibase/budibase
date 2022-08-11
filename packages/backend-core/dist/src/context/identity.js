"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountUserId = exports.doInAccountContext = exports.doInUserContext = exports.doInIdentityContext = exports.getIdentity = void 0;
const types_1 = require("@budibase/types");
const context = __importStar(require("."));
const getIdentity = () => {
    return context.getIdentity();
};
exports.getIdentity = getIdentity;
const doInIdentityContext = (identity, task) => {
    return context.doInIdentityContext(identity, task);
};
exports.doInIdentityContext = doInIdentityContext;
const doInUserContext = (user, task) => {
    const userContext = Object.assign(Object.assign({}, user), { _id: user._id, type: types_1.IdentityType.USER });
    return (0, exports.doInIdentityContext)(userContext, task);
};
exports.doInUserContext = doInUserContext;
const doInAccountContext = (account, task) => {
    const _id = (0, exports.getAccountUserId)(account);
    const tenantId = account.tenantId;
    const accountContext = {
        _id,
        type: types_1.IdentityType.USER,
        tenantId,
        account,
    };
    return (0, exports.doInIdentityContext)(accountContext, task);
};
exports.doInAccountContext = doInAccountContext;
const getAccountUserId = (account) => {
    let userId;
    if ((0, types_1.isCloudAccount)(account)) {
        userId = account.budibaseUserId;
    }
    else {
        // use account id as user id for self hosting
        userId = account.accountId;
    }
    return userId;
};
exports.getAccountUserId = getAccountUserId;
//# sourceMappingURL=identity.js.map