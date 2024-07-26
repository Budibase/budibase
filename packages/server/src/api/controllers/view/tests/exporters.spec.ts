import { generator } from "@budibase/backend-core/tests"
import { valueToCsv, parseCsvExport } from "../exporters"

describe("exporters", () => {
  describe("export and import", () => {
    it.each([
      ["string", generator.word()],
      ["integer", generator.natural()],
      ["float", generator.floating()],
      ["boolean", generator.bool()],
    ])("%s (%s)", (_, value) => {
      const exportedValue = valueToCsv(value)
      const importedValue = parseCsvExport(exportedValue)
      expect(importedValue).toEqual(value)
    })
  })
})
