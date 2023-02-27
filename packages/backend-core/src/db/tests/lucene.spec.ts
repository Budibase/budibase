import { newid } from "../../newid"
import { getDB } from "../db"
import { Database } from "@budibase/types"
import { QueryBuilder } from "../lucene"

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

  it("should be able to perform a basic query", async () => {
    const builder = new QueryBuilder(dbName, INDEX_NAME)
    const resp = await builder.run()
    expect(resp.rows.length).toBe(3)
  })

  it("should be able to perform a string search", async () => {
    const builder = new QueryBuilder(dbName, INDEX_NAME, {
      string: {
        property: "wo",
      },
    })
    const resp = await builder.run()
    expect(resp.rows.length).toBe(3)
  })

  it("should be able to perform a range search", async () => {
    const builder = new QueryBuilder(dbName, INDEX_NAME, {
      range: {
        number: {
          low: 0,
          high: 1,
        },
      },
    })
    const resp = await builder.run()
    expect(resp.rows.length).toBe(1)
  })

  it("should be able to perform an equal search", async () => {
    const builder = new QueryBuilder(dbName, INDEX_NAME, {
      equal: {
        property: "word2",
      },
    })
    const resp = await builder.run()
    expect(resp.rows.length).toBe(1)
  })

  it("should be able to perform a not equal search", async () => {
    const builder = new QueryBuilder(dbName, INDEX_NAME, {
      notEqual: {
        property: "word2",
      },
    })
    const resp = await builder.run()
    expect(resp.rows.length).toBe(2)
  })

  it("should be able to perform an empty search", async () => {
    const builder = new QueryBuilder(dbName, INDEX_NAME, {
      empty: {
        number: true,
      },
    })
    const resp = await builder.run()
    expect(resp.rows.length).toBe(2)
  })

  it("should be able to perform a not empty search", async () => {
    const builder = new QueryBuilder(dbName, INDEX_NAME, {
      notEmpty: {
        number: true,
      },
    })
    const resp = await builder.run()
    expect(resp.rows.length).toBe(1)
  })

  it("should be able to perform a one of search", async () => {
    const builder = new QueryBuilder(dbName, INDEX_NAME, {
      oneOf: {
        property: ["word", "word2"],
      },
    })
    const resp = await builder.run()
    expect(resp.rows.length).toBe(2)
  })

  it("should be able to perform a contains search", async () => {
    const builder = new QueryBuilder(dbName, INDEX_NAME, {
      contains: {
        property: ["word"],
      },
    })
    const resp = await builder.run()
    expect(resp.rows.length).toBe(1)
  })

  it("should be able to perform a not contains search", async () => {
    const builder = new QueryBuilder(dbName, INDEX_NAME, {
      notContains: {
        property: ["word2"],
      },
    })
    const resp = await builder.run()
    expect(resp.rows.length).toBe(2)
  })
})
