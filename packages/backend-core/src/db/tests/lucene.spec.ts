import { newid } from "../../docIds/newid"
import { getDB } from "../db"
import {
  Database,
  EmptyFilterOption,
  SortOrder,
  SortType,
  DocumentType,
  SEPARATOR,
} from "@budibase/types"
import { fullSearch, paginatedSearch, QueryBuilder } from "../lucene"

const INDEX_NAME = "main"
const TABLE_ID = DocumentType.TABLE + SEPARATOR + newid()

const index = `function(doc) {
  if (!doc._id.startsWith("ro_")) {
    return
  }
  let keys = Object.keys(doc).filter(key => !key.startsWith("_"))
  for (let key of keys) {
    const value = doc[key]
    if (Array.isArray(value)) {
      for (let val of value) {
        index(key, val)
      }
    } else if (value) {
      index(key, value)
    }
  }
}`

function rowId(id?: string) {
  return DocumentType.ROW + SEPARATOR + (id || newid())
}

describe("lucene", () => {
  let db: Database, dbName: string

  beforeAll(async () => {
    dbName = `db-${newid()}`
    // create the DB for testing
    db = getDB(dbName)
    await db.put({
      _id: rowId(),
      tableId: TABLE_ID,
      property: "word",
      array: ["1", "4"],
    })
    await db.put({
      _id: rowId(),
      tableId: TABLE_ID,
      property: "word2",
      array: ["3", "1"],
    })
    await db.put({
      _id: rowId(),
      tableId: TABLE_ID,
      property: "word3",
      number: 1,
      array: ["1", "2"],
    })
  })

  it("should be able to create a lucene index", async () => {
    const response = await db.put({
      _id: "_design/database",
      indexes: {
        [INDEX_NAME]: {
          index: index,
          analyzer: "standard",
        },
      },
    })
    expect(response.ok).toBe(true)
  })

  describe("query builder", () => {
    it("should be able to perform a basic query", async () => {
      const builder = new QueryBuilder(dbName, INDEX_NAME)
      builder.setSort("property")
      builder.setSortOrder("desc")
      builder.setSortType("string")
      const resp = await builder.run()
      expect(resp.rows.length).toBe(3)
    })

    it("should handle limits", async () => {
      const builder = new QueryBuilder(dbName, INDEX_NAME)
      builder.setLimit(1)
      const resp = await builder.run()
      expect(resp.rows.length).toBe(1)
    })

    it("should be able to perform a string search", async () => {
      const builder = new QueryBuilder(dbName, INDEX_NAME)
      builder.addString("property", "wo")
      const resp = await builder.run()
      expect(resp.rows.length).toBe(3)
    })

    it("should be able to perform a range search", async () => {
      const builder = new QueryBuilder(dbName, INDEX_NAME)
      builder.addRange("number", 0, 1)
      const resp = await builder.run()
      expect(resp.rows.length).toBe(1)
    })

    it("should be able to perform an equal search", async () => {
      const builder = new QueryBuilder(dbName, INDEX_NAME)
      builder.addEqual("property", "word2")
      const resp = await builder.run()
      expect(resp.rows.length).toBe(1)
    })

    it("should be able to perform a not equal search", async () => {
      const builder = new QueryBuilder(dbName, INDEX_NAME)
      builder.addNotEqual("property", "word2")
      const resp = await builder.run()
      expect(resp.rows.length).toBe(2)
    })

    it("should be able to perform an empty search", async () => {
      const builder = new QueryBuilder(dbName, INDEX_NAME)
      builder.addEmpty("number", true)
      const resp = await builder.run()
      expect(resp.rows.length).toBe(2)
    })

    it("should be able to perform a not empty search", async () => {
      const builder = new QueryBuilder(dbName, INDEX_NAME)
      builder.addNotEmpty("number", true)
      const resp = await builder.run()
      expect(resp.rows.length).toBe(1)
    })

    it("should be able to perform a one of search", async () => {
      const builder = new QueryBuilder(dbName, INDEX_NAME)
      builder.addOneOf("property", ["word", "word2"])
      const resp = await builder.run()
      expect(resp.rows.length).toBe(2)
    })

    it("should return all rows when doing a one of search against falsey value", async () => {
      const builder = new QueryBuilder(dbName, INDEX_NAME)
      builder.addOneOf("property", null)
      let resp = await builder.run()
      expect(resp.rows.length).toBe(3)

      builder.addOneOf("property", undefined)
      resp = await builder.run()
      expect(resp.rows.length).toBe(3)

      builder.addOneOf("property", "")
      resp = await builder.run()
      expect(resp.rows.length).toBe(3)

      builder.addOneOf("property", [])
      resp = await builder.run()
      expect(resp.rows.length).toBe(0)
    })

    it("should be able to perform a contains search", async () => {
      const builder = new QueryBuilder(dbName, INDEX_NAME)
      builder.addContains("property", ["word"])
      const resp = await builder.run()
      expect(resp.rows.length).toBe(1)
    })

    it("should be able to perform a not contains search", async () => {
      const builder = new QueryBuilder(dbName, INDEX_NAME)
      builder.addNotContains("property", ["word2"])
      const resp = await builder.run()
      expect(resp.rows.length).toBe(2)
    })

    it("should be able to perform an or not contains search", async () => {
      const builder = new QueryBuilder(dbName, INDEX_NAME)
      builder.addNotContains("array", ["1"])
      builder.addNotContains("array", ["2"])
      builder.setAllOr()
      const resp = await builder.run()
      expect(resp.rows.length).toBe(2)
    })

    describe("empty filters behaviour", () => {
      it("should return all rows by default", async () => {
        const builder = new QueryBuilder(dbName, INDEX_NAME)
        builder.addEqual("property", "")
        builder.addEqual("number", null)
        builder.addString("property", "")
        builder.addFuzzy("property", "")
        builder.addNotEqual("number", undefined)
        builder.addOneOf("number", null)
        builder.addContains("array", undefined)
        builder.addNotContains("array", null)
        builder.addContainsAny("array", null)

        const resp = await builder.run()
        expect(resp.rows.length).toBe(3)
      })

      it("should return all rows when onEmptyFilter is ALL", async () => {
        const builder = new QueryBuilder(dbName, INDEX_NAME)
        builder.setOnEmptyFilter(EmptyFilterOption.RETURN_ALL)
        builder.setAllOr()
        builder.addEqual("property", "")
        builder.addEqual("number", null)
        builder.addString("property", "")
        builder.addFuzzy("property", "")
        builder.addNotEqual("number", undefined)
        builder.addOneOf("number", null)
        builder.addContains("array", undefined)
        builder.addNotContains("array", null)
        builder.addContainsAny("array", null)

        const resp = await builder.run()
        expect(resp.rows.length).toBe(3)
      })

      it("should return no rows when onEmptyFilter is NONE", async () => {
        const builder = new QueryBuilder(dbName, INDEX_NAME)
        builder.setOnEmptyFilter(EmptyFilterOption.RETURN_NONE)
        builder.addEqual("property", "")
        builder.addEqual("number", null)
        builder.addString("property", "")
        builder.addFuzzy("property", "")
        builder.addNotEqual("number", undefined)
        builder.addOneOf("number", null)
        builder.addContains("array", undefined)
        builder.addNotContains("array", null)
        builder.addContainsAny("array", null)

        const resp = await builder.run()
        expect(resp.rows.length).toBe(0)
      })

      it("should return all matching rows when onEmptyFilter is NONE, but a filter value is provided", async () => {
        const builder = new QueryBuilder(dbName, INDEX_NAME)
        builder.setOnEmptyFilter(EmptyFilterOption.RETURN_NONE)
        builder.addEqual("property", "")
        builder.addEqual("number", 1)
        builder.addString("property", "")
        builder.addFuzzy("property", "")
        builder.addNotEqual("number", undefined)
        builder.addOneOf("number", null)
        builder.addContains("array", undefined)
        builder.addNotContains("array", null)
        builder.addContainsAny("array", null)

        const resp = await builder.run()
        expect(resp.rows.length).toBe(1)
      })
    })

    describe("skip", () => {
      const skipDbName = `db-${newid()}`
      let docs: {
        _id: string
        property: string
        array: string[]
      }[]

      beforeAll(async () => {
        const db = getDB(skipDbName)

        docs = Array(QueryBuilder.maxLimit * 2.5)
          .fill(0)
          .map((_, i) => ({
            _id: rowId(i.toString().padStart(3, "0")),
            tableId: TABLE_ID,
            property: `value_${i.toString().padStart(3, "0")}`,
            array: [],
          }))
        await db.bulkDocs(docs)

        await db.put({
          _id: "_design/database",
          indexes: {
            [INDEX_NAME]: {
              index: index,
              analyzer: "standard",
            },
          },
        })
      })

      it("should be able to apply skip", async () => {
        const builder = new QueryBuilder(skipDbName, INDEX_NAME)
        const firstResponse = await builder.run()
        builder.setSkip(40)
        const secondResponse = await builder.run()

        // Return the default limit
        expect(firstResponse.rows.length).toBe(50)
        expect(secondResponse.rows.length).toBe(50)

        // Should have the expected overlap
        expect(firstResponse.rows.slice(40)).toEqual(
          secondResponse.rows.slice(0, 10)
        )
      })

      it("should handle limits", async () => {
        const builder = new QueryBuilder(skipDbName, INDEX_NAME)
        builder.setLimit(10)
        builder.setSkip(50)
        builder.setSort("_id")

        const resp = await builder.run()
        expect(resp.rows.length).toBe(10)
        expect(resp.rows).toEqual(
          docs.slice(50, 60).map(expect.objectContaining)
        )
      })

      it("should be able to skip searching through multiple responses", async () => {
        const builder = new QueryBuilder(skipDbName, INDEX_NAME)
        // Skipping 2 max limits plus a little bit more
        const skip = QueryBuilder.maxLimit * 2 + 37
        builder.setSkip(skip)
        builder.setSort("_id")
        const resp = await builder.run()

        expect(resp.rows.length).toBe(50)
        expect(resp.rows).toEqual(
          docs.slice(skip, skip + resp.rows.length).map(expect.objectContaining)
        )
      })

      it("should not return results if skipping all docs", async () => {
        const builder = new QueryBuilder(skipDbName, INDEX_NAME)
        // Skipping 2 max limits plus a little bit more
        const skip = docs.length + 1
        builder.setSkip(skip)

        const resp = await builder.run()

        expect(resp.rows.length).toBe(0)
      })

      it("skip should respect with filters", async () => {
        const builder = new QueryBuilder(skipDbName, INDEX_NAME)
        builder.setLimit(10)
        builder.setSkip(50)
        builder.addString("property", "value_1")
        builder.setSort("property")

        const resp = await builder.run()
        expect(resp.rows.length).toBe(10)
        expect(resp.rows).toEqual(
          docs.slice(150, 160).map(expect.objectContaining)
        )
      })
    })
  })

  describe("paginated search", () => {
    it("should be able to perform a paginated search", async () => {
      const page = await paginatedSearch(
        dbName,
        INDEX_NAME,
        {
          string: {
            property: "wo",
          },
        },
        {
          tableId: TABLE_ID,
          limit: 1,
          sort: "property",
          sortType: SortType.STRING,
          sortOrder: SortOrder.DESCENDING,
        }
      )
      expect(page.rows.length).toBe(1)
      expect(page.hasNextPage).toBe(true)
      expect(page.bookmark).toBeDefined()
    })
  })

  describe("full search", () => {
    it("should be able to perform a full search", async () => {
      const page = await fullSearch(
        dbName,
        INDEX_NAME,
        {
          string: {
            property: "wo",
          },
        },
        {
          tableId: TABLE_ID,
          query: {},
        }
      )
      expect(page.rows.length).toBe(3)
    })
  })
})
