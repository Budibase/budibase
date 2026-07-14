import _ from "lodash"
import { AnyDocument } from "@budibase/types"
import { generator } from "../../../tests"
import { setEnv, withEnv } from "../../environment"
import { DatabaseImpl } from "../couch"
import { newid } from "../../utils"

describe("DatabaseImpl", () => {
  const database = new DatabaseImpl(generator.word())
  const documents: AnyDocument[] = []

  beforeAll(async () => {
    const docsToCreate = Array.from({ length: 10 }).map(() => ({
      _id: newid(),
    }))
    const createdDocs = await database.bulkDocs(docsToCreate)

    documents.push(...createdDocs.map((x: any) => ({ _id: x.id, _rev: x.rev })))
  })

  describe("document exists", () => {
    it("can check existing docs by id", async () => {
      const existingDoc = _.sample(documents)
      const result = await database.exists(existingDoc!._id!)

      expect(result).toBe(true)
    })

    it("can check non existing docs by id", async () => {
      const result = await database.exists(newid())

      expect(result).toBe(false)
    })

    it("can check an existing doc by id multiple times", async () => {
      const existingDoc = _.sample(documents)
      const id = existingDoc!._id!

      const results = []
      results.push(await database.exists(id))
      results.push(await database.exists(id))
      results.push(await database.exists(id))

      expect(results).toEqual([true, true, true])
    })

    it("returns false after the doc is deleted", async () => {
      const existingDoc = _.sample(documents)
      const id = existingDoc!._id!
      expect(await database.exists(id)).toBe(true)

      await database.remove(existingDoc!)
      expect(await database.exists(id)).toBe(false)
    })
  })

  describe("external connections", () => {
    afterEach(() => {
      setEnv({
        COUCH_DB_USERNAME: undefined,
        COUCH_DB_PASSWORD: undefined,
      })
    })

    it("does not leak env credentials into external connection strings", async () => {
      await withEnv(
        {
          COUCH_DB_USERNAME: "env-user",
          COUCH_DB_PASSWORD: "env-password",
        },
        async () => {
          const db = new DatabaseImpl(
            generator.word(),
            undefined,
            "http://url-user:url-password@example.com:5984"
          )

          expect((db as any).couchInfo.url).toBe("http://example.com:5984")
          expect((db as any).couchInfo.auth.username).toBe("url-user")
          expect((db as any).couchInfo.auth.password).toBe("url-password")
        }
      )
    })

    it("rejects external connection strings that would otherwise rely on env credentials", async () => {
      await withEnv(
        {
          COUCH_DB_USERNAME: "env-user",
          COUCH_DB_PASSWORD: "env-password",
        },
        async () => {
          expect(
            () =>
              new DatabaseImpl(
                generator.word(),
                undefined,
                "http://example.com:5984"
              )
          ).toThrow("CouchDB username not set")
        }
      )
    })
  })
})
