import { processStringSync, encodeJSBinding } from "@budibase/string-templates"
import TestConfiguration from "../../tests/utilities/TestConfiguration"

describe("jsRunner", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
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
})
