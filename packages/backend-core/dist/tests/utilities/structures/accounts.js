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
exports.cloudAccount = void 0;
const _1 = require(".");
const types_1 = require("@budibase/types");
const db = __importStar(require("../../../src/db/utils"));
const cloudAccount = () => {
    return {
        accountId: (0, _1.uuid)(),
        createdAt: Date.now(),
        verified: true,
        verificationSent: true,
        tier: "",
        email: _1.generator.email(),
        tenantId: _1.generator.word(),
        hosting: types_1.Hosting.CLOUD,
        authType: types_1.AuthType.PASSWORD,
        password: _1.generator.word(),
        tenantName: _1.generator.word(),
        name: _1.generator.name(),
        size: "10+",
        profession: "Software Engineer",
        budibaseUserId: db.generateGlobalUserID(),
    };
};
exports.cloudAccount = cloudAccount;
//# sourceMappingURL=accounts.js.map