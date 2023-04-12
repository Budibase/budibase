import env from "../environment"
import { env as coreEnv, timers } from "@budibase/backend-core"
import { testContainerUtils } from "@budibase/backend-core/tests"

if (!process.env.DEBUG) {
  global.console.log = jest.fn() // console.log are ignored in tests
  global.console.warn = jest.fn() // console.warn are ignored in tests
}

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
