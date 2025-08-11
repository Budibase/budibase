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
// Allow localhost and Docker Engine (unix socket) traffic used by testcontainers
nock.enableNetConnect(host => {
  // In some environments (unix socket requests) Nock passes a string like
  // "unix:///var/run/docker.sock". Permit these so testcontainers can talk
  // to the local Docker daemon.
  if (!host) return true
  const h = host.toLowerCase()
  return (
    h.includes("localhost") ||
    h.includes("127.0.0.1") ||
    h.includes("::1") ||
    h.startsWith("unix://") ||
    h.includes("/var/run/docker.sock")
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
