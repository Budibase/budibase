import { generator } from "@budibase/backend-core/tests"
import { valueToCsv, parseCsvExport } from "../exporters"

describe("exporters", () => {
  describe("export and import", () => {
    it.each([
      ["string", generator.word()],
      ["integer", generator.natural()],
      ["float", generator.floating()],
      ["boolean", generator.bool()],
      ["object", { name: generator.first(), age: generator.age() }],
      ["array of strings", generator.arrayOf(() => generator.word())],
      [
        "array of objects",
        generator.arrayOf(() => ({ name: generator.first() })),
      ],
    ])("%s (%s)", (_, value) => {
      const exportedValue = valueToCsv(value)
      const importedValue = parseCsvExport(exportedValue)

      expect(importedValue).toEqual(value)
    })
  })
})
