"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("../src/environment"));
const utilities_1 = require("../tests/utilities");
// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
const timekeeper_1 = __importDefault(require("timekeeper"));
timekeeper_1.default.freeze(utilities_1.mocks.date.MOCK_DATE);
environment_1.default._set("SELF_HOSTED", "1");
environment_1.default._set("NODE_ENV", "jest");
environment_1.default._set("JWT_SECRET", "test-jwtsecret");
environment_1.default._set("LOG_LEVEL", "silent");
//# sourceMappingURL=jestSetup.js.map