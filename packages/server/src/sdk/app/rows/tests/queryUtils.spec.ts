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

    it("keeps filter key numering", () => {
      const prefixedFilters: SearchFilters = {
        equal: { "1:one": "foo" },
        $or: {
          conditions: [
            {
              equal: { "2:one": "foo2", "3:two": "bar" },
              notEmpty: { "4:one": null },
              $and: {
                conditions: [
                  {
                    equal: { "5:three": "baz", two: "bar2" },
                    notEmpty: { forth: null },
                  },
                ],
              },
            },
          ],
        },
        $and: {
          conditions: [{ equal: { "6:one": "foo2" }, notEmpty: { one: null } }],
        },
      }

      const result = removeInvalidFilters(prefixedFilters, [
        "one",
        "three",
        "forth",
      ])
      expect(result).toEqual({
        equal: { "1:one": "foo" },
        $or: {
          conditions: [
            {
              equal: { "2:one": "foo2" },
              notEmpty: { "4:one": null },
              $and: {
                conditions: [
                  {
                    equal: { "5:three": "baz" },
                    notEmpty: { forth: null },
                  },
                ],
              },
            },
          ],
        },
        $and: {
          conditions: [{ equal: { "6:one": "foo2" }, notEmpty: { one: null } }],
        },
      })
    })
  })
})
