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
const { processString } = require("../src/index.cjs")

const tk = require("timekeeper")
tk.freeze("2021-01-21T12:00:00")

const manifest = JSON.parse(
  fs.readFileSync(require.resolve("../manifest.json"), "utf8")
)

const collections = Object.keys(manifest)
const examples = collections.reduce((acc, collection) => {
  const functions = Object.keys(manifest[collection]).filter(
    fnc => manifest[collection][fnc].example
  )
  if (functions.length) {
    acc[collection] = functions
  }
  return acc
}, {})

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
}

describe("manifest", () => {
  describe("examples are valid", () => {
    describe.each(Object.keys(examples))("%s", collection => {
      it.each(examples[collection])("%s", async func => {
        const example = manifest[collection][func].example

        let [hbs, js] = example.split("->").map(x => x.trim())

        const context = {
          double: i => i * 2,
          isString: x => typeof x === "string",
        }

        const arrays = hbs.match(/\[[^/\]]+\]/)
        arrays?.forEach((arrayString, i) => {
          hbs = hbs.replace(new RegExp(escapeRegExp(arrayString)), `array${i}`)
          context[`array${i}`] = JSON.parse(arrayString.replace(/\'/g, '"'))
        })

        if (js === undefined) {
          // The function has no return value
          return
        }

        let result = await processString(hbs, context)
        // Trim 's
        js = js.replace(/^\'|\'$/g, "")
        try {
          let parsedExpected
          if (
            Array.isArray((parsedExpected = JSON.parse(js.replace(/\'/g, '"'))))
          ) {
            if (typeof parsedExpected[0] === "object") {
              js = JSON.stringify(parsedExpected)
            } else {
              js = parsedExpected.join(",")
            }
          }
        } catch {}
        result = result.replace(/&nbsp;/g, " ")
        expect(result).toEqual(js)
      })
    })
  })
})
