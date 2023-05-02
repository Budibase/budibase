import { jsonFromCsvString } from "../csv"

describe("csv", () => {
  describe("jsonFromCsvString", () => {
    test("multiple lines csv can be casted", async () => {
      const csvString = '"id","title"\n"1","aaa"\n"2","bbb"'

      const result = await jsonFromCsvString(csvString)

      expect(result).toEqual([
        { id: "1", title: "aaa" },
        { id: "2", title: "bbb" },
      ])
    })
  })
})
