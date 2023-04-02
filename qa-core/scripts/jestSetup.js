// mock all dates to 2020-01-01T00:00:00.000Z
// use tk.reset() to use real dates in individual tests
const MOCK_DATE = new Date("2020-01-01T00:00:00.000Z")
const tk = require("timekeeper")
tk.freeze(MOCK_DATE)

if (!process.env.DEBUG) {
  global.console.log = jest.fn() // console.log are ignored in tests
}

jest.setTimeout(60000)
