"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __importDefault(require("../src/environment"));
const utilities_1 = require("./utilities");
// must explicitly enable fetch mock
utilities_1.mocks.fetch.enable();
// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
const timekeeper_1 = __importDefault(require("timekeeper"));
timekeeper_1.default.freeze(utilities_1.mocks.date.MOCK_DATE);
environment_1.default._set("SELF_HOSTED", "1");
environment_1.default._set("NODE_ENV", "jest");
environment_1.default._set("JWT_SECRET", "test-jwtsecret");
environment_1.default._set("LOG_LEVEL", "silent");
environment_1.default._set("MINIO_URL", "http://localhost");
environment_1.default._set("MINIO_ACCESS_KEY", "test");
environment_1.default._set("MINIO_SECRET_KEY", "test");
global.console.log = jest.fn(); // console.log are ignored in tests
if (!process.env.CI) {
    // set a longer timeout in dev for debugging
    // 100 seconds
    jest.setTimeout(100000);
}
//# sourceMappingURL=jestSetup.js.map