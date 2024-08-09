import "./core/logging"
import env from "../src/environment"
import { cleanup } from "../src/timers"
import { mocks, testContainerUtils } from "./core/utilities"
import nock from "nock"

// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
import tk from "timekeeper"

nock.disableNetConnect()
nock.enableNetConnect(host => {
  return (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("::1")
  )
})

tk.freeze(mocks.date.MOCK_DATE)

if (!process.env.DEBUG) {
  console.log = jest.fn() // console.log are ignored in tests
}

if (!process.env.CI) {
  // set a longer timeout in dev for debugging
  // 100 seconds
  jest.setTimeout(100000)
}

testContainerUtils.setupEnv(env)

afterAll(() => {
  cleanup()
})
