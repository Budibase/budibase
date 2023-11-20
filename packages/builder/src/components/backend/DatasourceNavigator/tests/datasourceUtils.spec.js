import { enrichDatasources } from "../datasourceUtils"

describe("datasourceUtils", () => {
  describe("enrichDatasources", () => {
    it.each([
      ["undefined", undefined],
      ["undefined list", {}],
      ["empty list", { list: [] }],
    ])("%s datasources will return an empty list", datasources => {
      const result = enrichDatasources(datasources)

      expect(result).toEqual([])
    })
  })
})
