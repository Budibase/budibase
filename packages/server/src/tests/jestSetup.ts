import env from "../environment"
import * as matchers from "jest-extended"
import { env as coreEnv, timers } from "@budibase/backend-core"
import { testContainerUtils } from "@budibase/backend-core/tests"
import nock from "nock"

expect.extend(matchers)
if (!process.env.CI) {
  // set a longer timeout in dev for debugging 100 seconds
  jest.setTimeout(100 * 1000)
} else {
  jest.setTimeout(30 * 1000)
}

// Disable real network connections and allow localhost only
// In nock v14, we need to ensure clean state before disabling net connect
nock.cleanAll()
nock.restore()
nock.activate()
nock.disableNetConnect()
nock.enableNetConnect(host => {
  return (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("::1")
  )
})

testContainerUtils.setupEnv(env, coreEnv)

// Ensure nock is properly cleaned after each test
afterEach(() => {
  if (!nock.isDone()) {
    nock.cleanAll()
  }
})

afterAll(async () => {
  timers.cleanup()
  nock.restore()
})
