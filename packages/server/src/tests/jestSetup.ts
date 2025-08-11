import env from "../environment"
import * as matchers from "jest-extended"
import { env as coreEnv, timers } from "@budibase/backend-core"
import { testContainerUtils } from "@budibase/backend-core/tests"
import nock from "nock"
import nodeFetch, {
  Headers as NFHeaders,
  Request as NFRequest,
  Response as NFResponse,
} from "node-fetch"

expect.extend(matchers)
if (!process.env.CI) {
  // set a longer timeout in dev for debugging 100 seconds
  jest.setTimeout(100 * 1000)
} else {
  jest.setTimeout(30 * 1000)
}
testContainerUtils.setupEnv(env, coreEnv)

// In nock v14, we should not globally activate nock as it intercepts ALL connections
// including database connections, causing EPIPE errors
// See: https://github.com/nock/nock/issues/2839
// Instead, we only configure which connections to block when nock IS activated
nock.disableNetConnect()
nock.enableNetConnect(host => {
  return (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("::1")
  )
})

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
