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

const fs = require("fs")
const {
  processString,
  convertToJS,
  processStringSync,
  encodeJSBinding,
} = require("../src/index.cjs")

const tk = require("timekeeper")

tk.freeze("2021-01-21T12:00:00")

const processJS = (js, context) => {
  return processStringSync(encodeJSBinding(js), context)
}

const manifest = JSON.parse(
  fs.readFileSync(require.resolve("../manifest.json"), "utf8")
)

const collections = Object.keys(manifest)
const examples = collections.reduce((acc, collection) => {
  const functions = Object.entries(manifest[collection])
    .filter(([_, details]) => details.example)
    .map(([name, details]) => {
      const example = details.example
      let [hbs, js] = example.split("->").map(x => x.trim())
      if (!js) {
        // The function has no return value
        return
      }

      // Trim 's
      js = js.replace(/^\'|\'$/g, "")
      if ((parsedExpected = tryParseJson(js))) {
        if (Array.isArray(parsedExpected)) {
          if (typeof parsedExpected[0] === "object") {
            js = JSON.stringify(parsedExpected)
          } else {
            js = parsedExpected.join(",")
          }
        }
      }
      return [name, hbs, js]
    })
    .filter(x => !!x)

  if (Object.keys(functions).length) {
    acc[collection] = functions
  }
  return acc
}, {})

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
}

function tryParseJson(str) {
  if (typeof str !== "string") {
    return
  }

  try {
    return JSON.parse(str.replace(/\'/g, '"'))
  } catch (e) {
    return
  }
}

describe("manifest", () => {
  describe("examples are valid", () => {
    describe.each(Object.keys(examples))("%s", collection => {
      it.each(examples[collection])("%s", async (_, hbs, js) => {
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
    describe.each(Object.keys(examples))("%s", collection => {
      it.each(examples[collection])("%s", async (_, hbs, js) => {
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
        convertedJs = convertedJs.replace(/\n/g, "\n")

        let result = processJS(convertedJs, context)
        result = result.replace(/&nbsp;/g, " ")
        expect(result).toEqual(js)
      })
    })
  })
})
