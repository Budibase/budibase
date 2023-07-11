import { getSingleFileMaxSizeInfo } from "../system"

describe("system", () => {
  describe("getSingleFileMaxSizeInfo", () => {
    it.each([
      ["100B", "50B"],
      ["200K", "100K"],
      ["20M", "10M"],
      ["4G", "2G"],
    ])(
      "Halving even number (%s) returns halved size and 1 history file (%s)",
      (totalValue, expectedMaxSize) => {
        const result = getSingleFileMaxSizeInfo(totalValue)
        expect(result).toEqual({
          size: expectedMaxSize,
          totalHistoryFiles: 1,
        })
      }
    )

    it.each([
      ["5B", "1B", 4],
      ["17K", "1K", 16],
      ["21M", "1M", 20],
      ["3G", "1G", 2],
    ])(
      "Halving an odd number (%s) returns as many files as size (-1) (%s)",
      (totalValue, expectedMaxSize, totalHistoryFiles) => {
        const result = getSingleFileMaxSizeInfo(totalValue)
        expect(result).toEqual({
          size: expectedMaxSize,
          totalHistoryFiles,
        })
      }
    )

    it.each([
      ["1B", "1B"],
      ["1K", "500B"],
      ["1M", "500K"],
      ["1G", "500M"],
    ])(
      "Halving '%s' returns halved unit (%s)",
      (totalValue, expectedMaxSize) => {
        const result = getSingleFileMaxSizeInfo(totalValue)
        expect(result).toEqual({
          size: expectedMaxSize,
          totalHistoryFiles: 1,
        })
      }
    )

    it.each([[undefined], [""], ["50"], ["wrongvalue"]])(
      "Halving wrongly formatted value ('%s') returns undefined",
      totalValue => {
        const result = getSingleFileMaxSizeInfo(totalValue!)
        expect(result).toBeUndefined()
      }
    )
  })
})
