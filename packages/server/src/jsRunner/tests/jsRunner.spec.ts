jest.mock("@budibase/handlebars-helpers/lib/math", () => {
  const actual = jest.requireActual("@budibase/handlebars-helpers/lib/math")

  return {
    ...actual,
    random: () => 10,
  }
})
jest.mock("@budibase/handlebars-helpers/lib/uuid", () => {
  const actual = jest.requireActual("@budibase/handlebars-helpers/lib/uuid")

  return {
    ...actual,
    uuid: () => "f34ebc66-93bd-4f7c-b79b-92b5569138bc",
  }
})

import { processStringSync, encodeJSBinding } from "@budibase/string-templates"
const { runJsHelpersTests } = require("@budibase/string-templates/test/utils")

import tk from "timekeeper"
import { init } from ".."
import TestConfiguration from "../../tests/utilities/TestConfiguration"
tk.freeze("2021-01-21T12:00:00")

describe("jsRunner", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    // Register js runner
    init()
    await config.init()
  })

  const processJS = (js: string, context?: object) => {
    return config.doInContext(config.getAppId(), async () =>
      processStringSync(encodeJSBinding(js), context || {})
    )
  }

  it("it can run a basic javascript", async () => {
    const output = await processJS(`return 1 + 2`)
    expect(output).toBe(3)
  })

  runJsHelpersTests({
    funcWrap: (func: any) => config.doInContext(config.getAppId(), func),
    testsToSkip: ["random", "uuid"],
  })
})
