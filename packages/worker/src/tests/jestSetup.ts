import env from "../environment"

env._set("SELF_HOSTED", "0")
env._set("NODE_ENV", "jest")
env._set("JWT_SECRET", "test-jwtsecret")
env._set("LOG_LEVEL", "silent")
env._set("MULTI_TENANCY", true)
env._set("MINIO_URL", "http://localhost")
env._set("MINIO_ACCESS_KEY", "test")
env._set("MINIO_SECRET_KEY", "test")
env._set("PLATFORM_URL", "http://localhost:10000")
env._set("INTERNAL_API_KEY", "test")
env._set("DISABLE_ACCOUNT_PORTAL", false)

import { mocks } from "@budibase/backend-core/tests"

// must explicitly enable fetch mock
mocks.fetch.enable()

// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
const tk = require("timekeeper")
tk.freeze(mocks.date.MOCK_DATE)

global.console.log = jest.fn() // console.log are ignored in tests

if (!process.env.CI) {
  // set a longer timeout in dev for debugging
  // 100 seconds
  jest.setTimeout(100000)
}
