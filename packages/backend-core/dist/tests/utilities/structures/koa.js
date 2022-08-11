"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newContext = void 0;
const jest_koa_mocks_1 = require("@shopify/jest-koa-mocks");
const newContext = () => {
    return (0, jest_koa_mocks_1.createMockContext)();
};
exports.newContext = newContext;
//# sourceMappingURL=koa.js.map