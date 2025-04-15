import { env } from "@budibase/backend-core"
import { CouchDBIntegration } from "../couchdb"
import { generator } from "@budibase/backend-core/tests"

function couchSafeID(): string {
  // CouchDB IDs must start with a letter, so we prepend an 'a'.
  return `a${generator.guid()}`
}

function doc(data: Record<string, any>): string {
  return JSON.stringify({ _id: couchSafeID(), ...data })
}

function query(data?: Record<string, any>): { json: string } {
  return { json: doc(data || {}) }
}

describe("CouchDB Integration", () => {
  let couchdb: CouchDBIntegration

  beforeEach(() => {
    couchdb = new CouchDBIntegration({
      url: env.COUCH_DB_URL,
      database: couchSafeID(),
    })
  })

  it("successfully connects", async () => {
    const { connected } = await couchdb.testConnection()
    expect(connected).toBe(true)
  })

  it("can create documents", async () => {
    const { id, ok, rev } = await couchdb.create(query({ test: 1 }))
    expect(id).toBeDefined()
    expect(ok).toBe(true)
    expect(rev).toBeDefined()
  })

  it("can read created documents", async () => {
    const { id, ok, rev } = await couchdb.create(query({ test: 1 }))
    expect(id).toBeDefined()
    expect(ok).toBe(true)
    expect(rev).toBeDefined()

    const docs = await couchdb.read(query())
    expect(docs).toEqual([
      {
        _id: id,
        _rev: rev,
        test: 1,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ])
  })

  it("can update documents", async () => {
    const { id, ok, rev } = await couchdb.create(query({ test: 1 }))
    expect(ok).toBe(true)

    const { id: newId, rev: newRev } = await couchdb.update(
      query({ _id: id, _rev: rev, test: 2 })
    )
    const docs = await couchdb.read(query())
    expect(docs).toEqual([
      {
        _id: newId,
        _rev: newRev,
        test: 2,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    ])
  })

  it("can delete documents", async () => {
    const { id, ok, rev } = await couchdb.create(query({ test: 1 }))
    expect(ok).toBe(true)

    const deleteResponse = await couchdb.delete({ id, rev })
    expect(deleteResponse.ok).toBe(true)

    const docs = await couchdb.read(query())
    expect(docs).toBeEmpty()
  })
})
