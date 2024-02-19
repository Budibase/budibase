import { validate as isValidUUID } from "uuid"
import { processStringSync, encodeJSBinding } from "@budibase/string-templates"

const { runJsHelpersTests } = require("@budibase/string-templates/test/utils")

import tk from "timekeeper"
import { init } from ".."
import TestConfiguration from "../../tests/utilities/TestConfiguration"

tk.freeze("2021-01-21T12:00:00")

describe("jsRunner (using isolated-vm)", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    // Register js runner
    init()
    await config.init()
  })

  afterAll(() => {
    config.end()
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

  it("it can execute sloppy javascript", async () => {
    const output = await processJS(`a=2;b=3;return a + b`)
    expect(output).toBe(5)
  })

  it("should prevent sandbox escape", async () => {
    const output = await processJS(
      `return this.constructor.constructor("return process.env")()`
    )
    expect(output).toBe("Error while executing JS")
  })

  describe("helpers", () => {
    runJsHelpersTests({
      funcWrap: (func: any) => config.doInContext(config.getAppId(), func),
      testsToSkip: ["random", "uuid"],
    })

    describe("uuid", () => {
      it("uuid helper returns a valid uuid", async () => {
        const result = await processJS("return helpers.uuid()")
        expect(result).toBeDefined()
        expect(isValidUUID(result)).toBe(true)
      })
    })

    describe("random", () => {
      it("random helper returns a valid number", async () => {
        const min = 1
        const max = 8
        const result = await processJS(`return helpers.random(${min}, ${max})`)
        expect(result).toBeDefined()
        expect(result).toBeGreaterThanOrEqual(min)
        expect(result).toBeLessThanOrEqual(max)
      })
    })
  })
})
