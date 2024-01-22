jest.mock("@budibase/handlebars-helpers/lib/math", () => {
  const actual = jest.requireActual("@budibase/handlebars-helpers/lib/math")

  return {
    ...actual,
    random: () => 10,
  }
})

const fs = require("fs")
const { processString } = require("../src/index.cjs")

const tk = require("timekeeper")
tk.freeze("2021-01-21T12:00:00")

const manifest = JSON.parse(
  fs.readFileSync(require.resolve("../manifest.json"), "utf8")
)

const examples = Object.keys(manifest).flatMap(collection =>
  Object.keys(manifest[collection]).map(fnc => [collection, fnc])
)

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
}

describe("manifest", () => {
  describe("examples are valid", () => {
    it.each(examples)("%s - %s", async (collection, func) => {
      const example = manifest[collection][func].example

      let [hbs, js] = example.split("->").map(x => x.trim())

      const context = {
        double: i => i * 2,
      }

      const arrays = hbs.match(/\[[^/\]]+\]/)
      arrays.forEach((arrayString, i) => {
        hbs = hbs.replace(new RegExp(escapeRegExp(arrayString)), `array${i}`)
        context[`array${i}`] = JSON.parse(arrayString.replace(/\'/g, '"'))
      })

      if (js === undefined) {
        // The function has no return value
        return
      }

      const result = await processString(hbs, context)
      try {
        let parsedExpected
        if (
          Array.isArray((parsedExpected = JSON.parse(js.replace(/\'/g, '"'))))
        ) {
          js = parsedExpected.join(",")
        }
      } catch {}
      expect(result).toEqual(js)
    })
  })
})
