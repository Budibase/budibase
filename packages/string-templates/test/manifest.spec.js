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

const {
  processString,
  convertToJS,
  processStringSync,
  encodeJSBinding,
} = require("../src/index.cjs")

const tk = require("timekeeper")
const { getJsHelperList } = require("../src/helpers")
const { getParsedManifest } = require("./utils")

tk.freeze("2021-01-21T12:00:00")

const processJS = (js, context) => {
  return processStringSync(encodeJSBinding(js), context)
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
}

describe("manifest", () => {
  const manifest = getParsedManifest()

  describe("examples are valid", () => {
    describe.each(Object.keys(manifest))("%s", collection => {
      it.each(manifest[collection])("%s", async (_, { hbs, js }) => {
        const context = {
          double: i => i * 2,
          isString: x => typeof x === "string",
        }

        const arrays = hbs.match(/\[[^/\]]+\]/)
        arrays?.forEach((arrayString, i) => {
          hbs = hbs.replace(new RegExp(escapeRegExp(arrayString)), `array${i}`)
          context[`array${i}`] = JSON.parse(arrayString.replace(/\'/g, '"'))
        })

        let result = await processString(hbs, context)
        result = result.replace(/&nbsp;/g, " ")
        expect(result).toEqual(js)
      })
    })
  })

  describe("can be parsed and run as js", () => {
    const jsHelpers = getJsHelperList()
    const jsExamples = Object.keys(manifest).reduce((acc, v) => {
      acc[v] = manifest[v].filter(([key]) => jsHelpers[key])
      return acc
    }, {})

    describe.each(Object.keys(jsExamples))("%s", collection => {
      it.each(
        jsExamples[collection].filter(
          ([_, { requiresHbsBody }]) => !requiresHbsBody
        )
      )("%s", async (_, { hbs, js }) => {
        const context = {
          double: i => i * 2,
          isString: x => typeof x === "string",
        }

        const arrays = hbs.match(/\[[^/\]]+\]/)
        arrays?.forEach((arrayString, i) => {
          hbs = hbs.replace(new RegExp(escapeRegExp(arrayString)), `array${i}`)
          context[`array${i}`] = JSON.parse(arrayString.replace(/\'/g, '"'))
        })

        let convertedJs = convertToJS(hbs)

        let result = processJS(convertedJs, context)
        result = result.replace(/&nbsp;/g, " ")
        expect(result).toEqual(js)
      })
    })
  })
})
