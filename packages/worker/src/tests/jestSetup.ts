import { mocks, testContainerUtils } from "@budibase/backend-core/tests"
import env from "../environment"
import { env as coreEnv, timers } from "@budibase/backend-core"
import nock from "nock"

// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
import tk from "timekeeper"

nock.disableNetConnect()
nock.enableNetConnect(host => {
  return (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("::1") ||
    host.includes("ethereal.email") // used in realEmail.spec.ts
  )
})

tk.freeze(mocks.date.MOCK_DATE)

if (!process.env.CI) {
  // set a longer timeout in dev for debugging
  // 100 seconds
  jest.setTimeout(100 * 1000)
} else {
  jest.setTimeout(10 * 1000)
}

testContainerUtils.setupEnv(env, coreEnv)

afterAll(() => {
  timers.cleanup()
})
