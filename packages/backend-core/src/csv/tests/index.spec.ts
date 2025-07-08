import { jsonFromCsvString } from "../"

describe("csv", () => {
  describe("jsonFromCsvString", () => {
    test("multiple lines csv can be casted", async () => {
      const csvString = '"id","title"\n"1","aaa"\n"2","bbb"'

      const result = await jsonFromCsvString(csvString)

      expect(result).toEqual([
        { id: "1", title: "aaa" },
        { id: "2", title: "bbb" },
      ])
      result.forEach(r => expect(Object.keys(r)).toEqual(["id", "title"]))
    })

    test("empty values are coerced to null", async () => {
      const csvString =
        '"id","optional","title"\n1,,"aaa"\n2,"value","bbb"\n3,,"ccc"'

      const result = await jsonFromCsvString(csvString)

      expect(result).toEqual([
        { id: "1", optional: null, title: "aaa" },
        { id: "2", optional: "value", title: "bbb" },
        { id: "3", optional: null, title: "ccc" },
      ])
      result.forEach(r =>
        expect(Object.keys(r)).toEqual(["id", "optional", "title"])
      )
    })

    const possibleDelimeters = [",", ";", ":", "|", "~", "\t", " "]

    const csvArray = [
      ["id", "title"],
      ["1", "aaa"],
      ["2", "bbb"],
      ["3", "c ccc"],
      ["", ""],
      [":5", "eee5:e"],
    ]

    test.each(possibleDelimeters)(
      "Should parse with delimiter %s",
      async delimiter => {
        const csvString = csvArray
          .map(row => row.map(col => `"${col}"`).join(delimiter))
          .join("\n")
        const result = await jsonFromCsvString(csvString)

        expect(result).toEqual([
          { id: "1", title: "aaa" },
          { id: "2", title: "bbb" },
          { id: "3", title: "c ccc" },
          { id: null, title: null },
          { id: ":5", title: "eee5:e" },
        ])
      }
    )
  })
})
