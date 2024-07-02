import "./core/logging"
import env from "../src/environment"
import { cleanup } from "../src/timers"
import { mocks, testContainerUtils } from "./core/utilities"

// must explicitly enable fetch mock
mocks.fetch.enable()

// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
import tk from "timekeeper"
import { shutdownAll } from "../src/redis/redis"

tk.freeze(mocks.date.MOCK_DATE)

if (!process.env.DEBUG) {
  console.log = jest.fn() // console.log are ignored in tests
}

testContainerUtils.setupEnv(env)

afterAll(async () => {
  await shutdownAll()
  cleanup()
})
