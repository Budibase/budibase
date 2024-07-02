import { mocks, testContainerUtils } from "@budibase/backend-core/tests"
import env from "../environment"
import { env as coreEnv, timers } from "@budibase/backend-core"

// must explicitly enable fetch mock
mocks.fetch.enable()

// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
const tk = require("timekeeper")

tk.freeze(mocks.date.MOCK_DATE)

if (!process.env.CI) {
  // set a longer timeout in dev for debugging
  // 100 seconds
  jest.setTimeout(100 * 1000)
} else {
  jest.setTimeout(10 * 1000)
}

testContainerUtils.setupEnv(env, coreEnv)

afterAll(async () => {
  timers.cleanup()

  // We don't import the index at the top level because it will import a lot of
  // things, ruining the potential to mock them in tests.
  const main = require("../")
  await main.shutdown()
})
