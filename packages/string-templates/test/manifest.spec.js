const fs = require("fs")
const { processString } = require("../src/index.cjs")

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

      const [hbs, js] = example.split("->").map(x => x.trim())

      expect(await processString(hbs)).toEqual(js)
    })
  })
})
