"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountByTenantId = exports.getAccount = void 0;
exports.getAccount = jest.fn();
exports.getAccountByTenantId = jest.fn();
jest.mock("../../../src/cloud/accounts", () => ({
    getAccount: exports.getAccount,
    getAccountByTenantId: exports.getAccountByTenantId,
}));
//# sourceMappingURL=accounts.js.map