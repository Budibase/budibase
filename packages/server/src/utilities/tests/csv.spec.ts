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
      result.forEach(r => expect(Object.keys(r)).toEqual(["id", "title"]))
    })

    test("empty values are casted as undefined", async () => {
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
  })
})
