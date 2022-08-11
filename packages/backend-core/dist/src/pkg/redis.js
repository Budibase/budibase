"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Mimic the outer package export for usage in index.ts
// The outer exports can't be used as they now reference dist directly
const redis_1 = __importDefault(require("../redis"));
const utils_1 = __importDefault(require("../redis/utils"));
const init_1 = __importDefault(require("../redis/init"));
module.exports = {
    Client: redis_1.default,
    utils: utils_1.default,
    clients: init_1.default,
};
//# sourceMappingURL=redis.js.map