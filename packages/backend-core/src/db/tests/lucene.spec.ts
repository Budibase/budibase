import { newid } from "../../newid"
import { getDB } from "../db"
import { Database } from "@budibase/types"
import { QueryBuilder, paginatedSearch, fullSearch } from "../lucene"

const INDEX_NAME = "main"

const index = `function(doc) {
  let props = ["property", "number"]
  for (let key of props) {
    if (doc[key]) {
      index(key, doc[key])
    }
  }
}`

describe("lucene", () => {
  let db: Database, dbName: string

  beforeAll(async () => {
    dbName = `db-${newid()}`
    // create the DB for testing
    db = getDB(dbName)
    await db.put({ _id: newid(), property: "word" })
    await db.put({ _id: newid(), property: "word2" })
    await db.put({ _id: newid(), property: "word3", number: 1 })
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
          limit: 1,
          sort: "property",
          sortType: "string",
          sortOrder: "desc",
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
        {}
      )
      expect(page.rows.length).toBe(3)
    })
  })
})
