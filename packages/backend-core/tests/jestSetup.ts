import env from "../src/environment"
import { mocks } from "./utilities"

// must explicitly enable fetch mock
mocks.fetch.enable()

// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
import tk from "timekeeper"
tk.freeze(mocks.date.MOCK_DATE)

env._set("SELF_HOSTED", "1")
env._set("NODE_ENV", "jest")
env._set("JWT_SECRET", "test-jwtsecret")
env._set("LOG_LEVEL", "silent")
env._set("MINIO_URL", "http://localhost")
env._set("MINIO_ACCESS_KEY", "test")
env._set("MINIO_SECRET_KEY", "test")

global.console.log = jest.fn() // console.log are ignored in tests

if (!process.env.CI) {
  // set a longer timeout in dev for debugging
  // 100 seconds
  jest.setTimeout(100000)
}
