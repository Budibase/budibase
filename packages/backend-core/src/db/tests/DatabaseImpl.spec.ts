import _ from "lodash"
import { AnyDocument } from "@budibase/types"
import { generator } from "../../../tests"
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
})
