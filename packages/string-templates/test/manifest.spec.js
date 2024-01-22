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

describe("manifest", () => {
  describe("examples are valid", () => {
    it.each(examples)("%s - %s", async (collection, func) => {
      const example = manifest[collection][func].example

      let [hbs, js] = example.split("->").map(x => x.trim())
      hbs = hbs.replace(/\[1, 2, 3\]/, "array3")
      hbs = hbs.replace(/\[1, 2, 3, 4\]/, "array4")

      if (js === undefined) {
        // The function has no return value
        return
      }

      expect(
        await processString(hbs, {
          array3: [1, 2, 3],
          array4: [1, 2, 3, 4],
        })
      ).toEqual(js)
    })
  })
})
