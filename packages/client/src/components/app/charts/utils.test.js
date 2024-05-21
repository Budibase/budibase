import { expect, describe, it, vi } from "vitest"
import { cloneDeep } from "./utils"

describe("utils", () => {
  let context

  beforeEach(() => {
    vi.clearAllMocks()
    context = {}
  })

  describe("cloneDeep", () => {
    beforeEach(() => {
      context.value = {
        obj: { one: 1, two: 2 },
        arr: [1, { first: null, second: undefined }, 2],
        str: "test",
        num: 123,
        bool: true,
        sym: Symbol("test"),
        func: () => "some value",
      }
      context.cloneValue = cloneDeep(context.value)
    })

    it("to clone the object and not copy object references", () => {
      expect(context.cloneValue.obj.one).toEqual(1)
      expect(context.cloneValue.obj.two).toEqual(2)
    })
  })
})
