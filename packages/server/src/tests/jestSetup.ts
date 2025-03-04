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

nock.disableNetConnect()
nock.enableNetConnect(host => {
  return (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("::1")
  )
})

testContainerUtils.setupEnv(env, coreEnv)

afterAll(() => {
  timers.cleanup()
})
