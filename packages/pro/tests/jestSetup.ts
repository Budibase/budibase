import { env } from "@budibase/backend-core"
import { testContainerUtils } from "@budibase/backend-core/tests"

testContainerUtils.setupEnv(env)

// init mocks
import mocks from "./mocks"

// use unlimited license by default
mocks.licenses.useUnlimited()

// init db config
import * as db from "./db"

db.init()

import tk from "timekeeper"
// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
tk.freeze(mocks.date.MOCK_DATE)

if (!process.env.CI) {
  // set a longer timeout in dev for debugging
  // 100 seconds
  jest.setTimeout(100 * 1000)
} else {
  jest.setTimeout(10 * 1000)
}

if (!process.env.DEBUG) {
  global.console.log = jest.fn() // console.log are ignored in tests
}
