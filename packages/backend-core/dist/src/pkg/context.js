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
// Mimic the outer package export for usage in index.ts
// The outer exports can't be used as they now reference dist directly
const context_1 = require("../context");
const identity = __importStar(require("../context/identity"));
module.exports = {
    getAppDB: context_1.getAppDB,
    getDevAppDB: context_1.getDevAppDB,
    getProdAppDB: context_1.getProdAppDB,
    getAppId: context_1.getAppId,
    updateAppId: context_1.updateAppId,
    doInAppContext: context_1.doInAppContext,
    doInTenant: context_1.doInTenant,
    identity,
};
//# sourceMappingURL=context.js.map