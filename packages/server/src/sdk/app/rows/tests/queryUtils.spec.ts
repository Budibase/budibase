import {
  FieldType,
  RelationshipType,
  SearchFilters,
  Table,
} from "@budibase/types"
import { getQueryableFields, removeInvalidFilters } from "../queryUtils"
import { structures } from "../../../../api/routes/tests/utilities"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"

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

    it("handles relationship filters", () => {
      const prefixedFilters: SearchFilters = {
        $or: {
          conditions: [
            { equal: { "1:other.one": "foo" } },
            {
              equal: {
                "2:other.one": "foo2",
                "3:other.two": "bar",
                "4:other.three": "baz",
              },
            },
            { equal: { "another.three": "baz2" } },
          ],
        },
      }

      const result = removeInvalidFilters(prefixedFilters, [
        "other.one",
        "other.two",
        "another.three",
      ])
      expect(result).toEqual({
        $or: {
          conditions: [
            { equal: { "1:other.one": "foo" } },
            { equal: { "2:other.one": "foo2", "3:other.two": "bar" } },
            { equal: { "another.three": "baz2" } },
          ],
        },
      })
    })
  })

  describe("getQueryableFields", () => {
    const config = new TestConfiguration()

    beforeAll(async () => {
      await config.init()
    })

    it("returns table schema fields and _id", async () => {
      const table: Table = {
        ...structures.basicTable(),
        schema: {
          name: { name: "name", type: FieldType.STRING },
          age: { name: "age", type: FieldType.NUMBER },
        },
      }

      const result = await getQueryableFields(Object.keys(table.schema), table)
      expect(result).toEqual(["_id", "name", "age"])
    })

    it("excludes hidden fields", async () => {
      const table: Table = {
        ...structures.basicTable(),
        schema: {
          name: { name: "name", type: FieldType.STRING },
          age: { name: "age", type: FieldType.NUMBER, visible: false },
        },
      }

      const result = await getQueryableFields(Object.keys(table.schema), table)
      expect(result).toEqual(["_id", "name"])
    })

    it("includes relationship fields", async () => {
      const aux: Table = await config.api.table.save({
        ...structures.basicTable(),
        name: "auxTable",
        schema: {
          title: { name: "title", type: FieldType.STRING },
          name: { name: "name", type: FieldType.STRING },
        },
      })

      const table: Table = {
        ...structures.basicTable(),
        schema: {
          name: { name: "name", type: FieldType.STRING },
          aux: {
            name: "aux",
            type: FieldType.LINK,
            tableId: aux._id!,
            relationshipType: RelationshipType.ONE_TO_MANY,
            fieldName: "table",
          },
        },
      }

      const result = await config.doInContext(config.appId, () => {
        return getQueryableFields(Object.keys(table.schema), table)
      })
      expect(result).toEqual([
        "_id",
        "name",
        "aux.title",
        "auxTable.title",
        "aux.name",
        "auxTable.name",
      ])
    })

    it("excludes hidden relationship fields", async () => {
      const aux: Table = await config.api.table.save({
        ...structures.basicTable(),
        name: "auxTable",
        schema: {
          title: { name: "title", type: FieldType.STRING, visible: false },
          name: { name: "name", type: FieldType.STRING, visible: true },
        },
      })

      const table: Table = {
        ...structures.basicTable(),
        schema: {
          name: { name: "name", type: FieldType.STRING },
          aux: {
            name: "aux",
            type: FieldType.LINK,
            tableId: aux._id!,
            relationshipType: RelationshipType.ONE_TO_MANY,
            fieldName: "table",
          },
        },
      }

      const result = await config.doInContext(config.appId, () => {
        return getQueryableFields(Object.keys(table.schema), table)
      })
      expect(result).toEqual(["_id", "name", "aux.name", "auxTable.name"])
    })

    it("excludes all relationship fields if hidden", async () => {
      const aux: Table = await config.api.table.save({
        ...structures.basicTable(),
        name: "auxTable",
        schema: {
          title: { name: "title", type: FieldType.STRING, visible: false },
          name: { name: "name", type: FieldType.STRING, visible: true },
        },
      })

      const table: Table = {
        ...structures.basicTable(),
        schema: {
          name: { name: "name", type: FieldType.STRING },
          aux: {
            name: "aux",
            type: FieldType.LINK,
            tableId: aux._id!,
            relationshipType: RelationshipType.ONE_TO_MANY,
            fieldName: "table",
            visible: false,
          },
        },
      }

      const result = await config.doInContext(config.appId, () => {
        return getQueryableFields(Object.keys(table.schema), table)
      })
      expect(result).toEqual(["_id", "name"])
    })

    it("includes nested relationship fields", async () => {
      const aux1: Table = await config.api.table.save({
        ...structures.basicTable(),
        name: "aux1Table",
        schema: {
          name: { name: "name", type: FieldType.STRING },
        },
      })
      const aux2: Table = await config.api.table.save({
        ...structures.basicTable(),
        name: "aux2Table",
        schema: {
          title: { name: "title", type: FieldType.STRING },
          aux1: {
            name: "aux1",
            type: FieldType.LINK,
            tableId: aux1._id!,
            relationshipType: RelationshipType.ONE_TO_MANY,
            fieldName: "aux2",
          },
        },
      })

      const table: Table = {
        ...structures.basicTable(),
        schema: {
          name: { name: "name", type: FieldType.STRING },
          aux: {
            name: "aux",
            type: FieldType.LINK,
            tableId: aux2._id!,
            relationshipType: RelationshipType.ONE_TO_MANY,
            fieldName: "table",
          },
        },
      }

      const result = await config.doInContext(config.appId, () => {
        return getQueryableFields(Object.keys(table.schema), table)
      })
      expect(result).toEqual([
        "_id",
        "name",
        // Aux primitive props
        "aux.title",
        "aux2Table.title",

        // Aux deep 1 primitive props
        "aux.aux1.name",
        "aux2Table.aux1.name",

        // Aux deep 2 primitive props
        "aux.aux1Table.name",
        "aux2Table.aux1Table.name",
      ])
    })
  })
})
