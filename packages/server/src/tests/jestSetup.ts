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
testContainerUtils.setupEnv(env, coreEnv)

nock.enableNetConnect()

// Ensure nock is properly cleaned after each test
afterEach(() => {
  // Only clean if nock is active (has interceptors)
  if (nock.isActive()) {
    nock.cleanAll()
  }
})

afterAll(async () => {
  timers.cleanup()
  // Restore nock to clean state
  if (nock.isActive()) {
    nock.restore()
  }
})
