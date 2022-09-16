const env = require("../src/environment")

env._set("BUDIBASE_SERVER_URL", "http://localhost:4100")
env._set(
  "BUDIBASE_PUBLIC_API_KEY",
  "a65722f06bee5caeadc5d7ca2f543a43-d610e627344210c643bb726f"
)

// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
const MOCK_DATE = new Date("2020-01-01T00:00:00.000Z")
const tk = require("timekeeper")
tk.freeze(MOCK_DATE)

if (!process.env.DEBUG) {
  global.console.log = jest.fn() // console.log are ignored in tests
}
