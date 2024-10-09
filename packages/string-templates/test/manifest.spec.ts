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

import { defaultJSSetup, processString } from "../src/index"

import tk from "timekeeper"
import { getParsedManifest, runJsHelpersTests } from "./utils"

tk.freeze("2021-01-21T12:00:00")

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
}

describe("manifest", () => {
  const manifest = getParsedManifest()

  beforeAll(() => {
    defaultJSSetup()
  })

  describe("examples are valid", () => {
    describe.each(Object.keys(manifest))("%s", collection => {
      it.each(manifest[collection])("%s", async (_, { hbs, js }) => {
        const context: any = {
          double: (i: number) => i * 2,
          isString: (x: any) => typeof x === "string",
        }

        const arrays = hbs.match(/\[[^/\]]+\]/)
        arrays?.forEach((arrayString, i) => {
          hbs = hbs.replace(new RegExp(escapeRegExp(arrayString)), `array${i}`)
          context[`array${i}`] = JSON.parse(arrayString.replace(/'/g, '"'))
        })

        let result = await processString(hbs, context)
        result = result.replace(/&nbsp;/g, " ")
        expect(result).toEqual(js)
      })
    })
  })

  runJsHelpersTests()
})
