import { SearchFilters } from "@budibase/types"
import { removeInvalidFilters } from "../queryUtils"

describe("query utils", () => {
  describe("removeInvalidFilters", () => {
    const fullFilters: SearchFilters = {
      equal: { one: "foo" },
      $or: {
        conditions: [
          {
            equal: { one: "foo2", two: "bar" },
            notEmpty: { one: null },
            $and: {
              conditions: [
                {
                  equal: { three: "baz" },
                  notEmpty: { forth: null },
                },
              ],
            },
          },
        ],
      },
      $and: {
        conditions: [{ equal: { one: "foo2" }, notEmpty: { one: null } }],
      },
    }

    it("can filter empty queries", () => {
      const filters: SearchFilters = {}
      const result = removeInvalidFilters(filters, [])
      expect(result).toEqual({})
    })

    it("does not trim any valid field", () => {
      const result = removeInvalidFilters(fullFilters, [
        "one",
        "two",
        "three",
        "forth",
      ])
      expect(result).toEqual(fullFilters)
    })

    it("trims invalid field", () => {
      const result = removeInvalidFilters(fullFilters, [
        "one",
        "three",
        "forth",
      ])
      expect(result).toEqual({
        equal: { one: "foo" },
        $or: {
          conditions: [
            {
              equal: { one: "foo2" },
              notEmpty: { one: null },
              $and: {
                conditions: [
                  {
                    equal: { three: "baz" },
                    notEmpty: { forth: null },
                  },
                ],
              },
            },
          ],
        },
        $and: {
          conditions: [{ equal: { one: "foo2" }, notEmpty: { one: null } }],
        },
      })
    })

    it("trims invalid field keeping a valid fields", () => {
      const result = removeInvalidFilters(fullFilters, ["three", "forth"])
      const expected: SearchFilters = {
        $or: {
          conditions: [
            {
              $and: {
                conditions: [
                  {
                    equal: { three: "baz" },
                    notEmpty: { forth: null },
                  },
                ],
              },
            },
          ],
        },
      }
      expect(result).toEqual(expected)
    })
  })
})
