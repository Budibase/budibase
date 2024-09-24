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
      const table: Table = await config.api.table.save({
        ...structures.basicTable(),
        schema: {
          name: { name: "name", type: FieldType.STRING },
          age: { name: "age", type: FieldType.NUMBER },
        },
      })

      const result = await getQueryableFields(table)
      expect(result).toEqual(["_id", "name", "age"])
    })

    it("excludes hidden fields", async () => {
      const table: Table = await config.api.table.save({
        ...structures.basicTable(),
        schema: {
          name: { name: "name", type: FieldType.STRING },
          age: { name: "age", type: FieldType.NUMBER, visible: false },
        },
      })

      const result = await getQueryableFields(table)
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

      const table: Table = await config.api.table.save({
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
      })

      const result = await config.doInContext(config.appId, () => {
        return getQueryableFields(table)
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

      const table: Table = await config.api.table.save({
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
      })

      const result = await config.doInContext(config.appId, () => {
        return getQueryableFields(table)
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

      const table: Table = await config.api.table.save({
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
      })

      const result = await config.doInContext(config.appId, () => {
        return getQueryableFields(table)
      })
      expect(result).toEqual(["_id", "name"])
    })

    describe("nested relationship", () => {
      describe("one-to-many", () => {
        let table: Table, aux1: Table, aux2: Table

        beforeAll(async () => {
          const { _id: aux1Id } = await config.api.table.save({
            ...structures.basicTable(),
            name: "aux1Table",
            schema: {
              name: { name: "name", type: FieldType.STRING },
            },
          })
          const { _id: aux2Id } = await config.api.table.save({
            ...structures.basicTable(),
            name: "aux2Table",
            schema: {
              title: { name: "title", type: FieldType.STRING },
              aux1_1: {
                name: "aux1_1",
                type: FieldType.LINK,
                tableId: aux1Id!,
                relationshipType: RelationshipType.ONE_TO_MANY,
                fieldName: "aux2_1",
              },
              aux1_2: {
                name: "aux1_2",
                type: FieldType.LINK,
                tableId: aux1Id!,
                relationshipType: RelationshipType.ONE_TO_MANY,
                fieldName: "aux2_2",
              },
            },
          })

          const { _id: tableId } = await config.api.table.save({
            ...structures.basicTable(),
            schema: {
              name: { name: "name", type: FieldType.STRING },
              aux1: {
                name: "aux1",
                type: FieldType.LINK,
                tableId: aux1Id!,
                relationshipType: RelationshipType.ONE_TO_MANY,
                fieldName: "table",
              },
              aux2: {
                name: "aux2",
                type: FieldType.LINK,
                tableId: aux2Id!,
                relationshipType: RelationshipType.ONE_TO_MANY,
                fieldName: "table",
              },
            },
          })

          // We need to refech them to get the updated foreign keys
          aux1 = await config.api.table.get(aux1Id!)
          aux2 = await config.api.table.get(aux2Id!)
          table = await config.api.table.get(tableId!)
        })

        it("includes nested relationship fields from main table", async () => {
          const result = await config.doInContext(config.appId, () => {
            return getQueryableFields(table)
          })
          expect(result).toEqual([
            "_id",
            "name",
            // aux1 primitive props
            "aux1.name",
            "aux1Table.name",

            // aux2 primitive props
            "aux2.title",
            "aux2Table.title",
          ])
        })

        it("includes nested relationship fields from aux 1 table", async () => {
          const result = await config.doInContext(config.appId, () => {
            return getQueryableFields(aux1)
          })
          expect(result).toEqual([
            "_id",
            "name",

            // aux2_1 primitive props
            "aux2_1.title",
            "aux2Table.title",

            // aux2_2 primitive props
            "aux2_2.title",
            "aux2Table.title",

            // table primitive props
            "table.name",
            "TestTable.name",
          ])
        })

        it("includes nested relationship fields from aux 2 table", async () => {
          const result = await config.doInContext(config.appId, () => {
            return getQueryableFields(aux2)
          })
          expect(result).toEqual([
            "_id",
            "title",

            // aux1_1 primitive props
            "aux1_1.name",
            "aux1Table.name",

            // aux1_2 primitive props
            "aux1_2.name",
            "aux1Table.name",

            // table primitive props
            "table.name",
            "TestTable.name",
          ])
        })
      })

      describe("many-to-many", () => {
        let table: Table, aux: Table

        beforeAll(async () => {
          const { _id: auxId } = await config.api.table.save({
            ...structures.basicTable(),
            name: "auxTable",
            schema: {
              title: { name: "title", type: FieldType.STRING },
            },
          })

          const { _id: tableId } = await config.api.table.save({
            ...structures.basicTable(),
            schema: {
              name: { name: "name", type: FieldType.STRING },
              aux: {
                name: "aux",
                type: FieldType.LINK,
                tableId: auxId!,
                relationshipType: RelationshipType.MANY_TO_MANY,
                fieldName: "table",
              },
            },
          })

          // We need to refech them to get the updated foreign keys
          aux = await config.api.table.get(auxId!)
          table = await config.api.table.get(tableId!)
        })

        it("includes nested relationship fields from main table", async () => {
          const result = await config.doInContext(config.appId, () => {
            return getQueryableFields(table)
          })
          expect(result).toEqual([
            "_id",
            "name",

            // deep 1 aux primitive props
            "aux.title",
            "auxTable.title",
          ])
        })

        it("includes nested relationship fields from aux table", async () => {
          const result = await config.doInContext(config.appId, () => {
            return getQueryableFields(aux)
          })
          expect(result).toEqual([
            "_id",
            "title",

            // deep 1 dependency primitive props
            "table.name",
            "TestTable.name",
          ])
        })
      })
    })
  })
})
