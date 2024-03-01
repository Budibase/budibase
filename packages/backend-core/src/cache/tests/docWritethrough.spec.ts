import tk from "timekeeper"

import { DBTestConfiguration, generator, structures } from "../../../tests"
import { getDB } from "../../db"
import { DocWritethrough } from "../docWritethrough"
import _ from "lodash"

const WRITE_RATE_MS = 500

const initialTime = Date.now()

function resetTime() {
  tk.travel(initialTime)
}
function travelForward(ms: number) {
  const updatedTime = Date.now() + ms
  tk.travel(updatedTime)
}

describe("docWritethrough", () => {
  const config = new DBTestConfiguration()

  const db = getDB(structures.db.id())
  let documentId: string
  let docWritethrough: DocWritethrough

  describe("patch", () => {
    function generatePatchObject(fieldCount: number) {
      const keys = generator.unique(() => generator.word(), fieldCount)
      return keys.reduce((acc, c) => {
        acc[c] = generator.word()
        return acc
      }, {} as Record<string, any>)
    }

    beforeEach(() => {
      resetTime()
      documentId = structures.db.id()
      docWritethrough = new DocWritethrough(db, documentId, WRITE_RATE_MS)
    })

    it("patching will not persist if timeout from the creation does not hit", async () => {
      await config.doInTenant(async () => {
        travelForward(WRITE_RATE_MS)
        await docWritethrough.patch(generatePatchObject(2))
        await docWritethrough.patch(generatePatchObject(2))
        travelForward(WRITE_RATE_MS - 1)
        await docWritethrough.patch(generatePatchObject(2))

        expect(await db.docExists(documentId)).toBe(false)
      })
    })

    it("patching will persist if timeout hits and next patch is called", async () => {
      await config.doInTenant(async () => {
        const patch1 = generatePatchObject(2)
        const patch2 = generatePatchObject(2)
        await docWritethrough.patch(patch1)
        await docWritethrough.patch(patch2)

        travelForward(WRITE_RATE_MS)

        const patch3 = generatePatchObject(3)
        await docWritethrough.patch(patch3)

        expect(await db.get(documentId)).toEqual({
          _id: documentId,
          ...patch1,
          ...patch2,
          ...patch3,
          _rev: expect.stringMatching(/1-.+/),
          createdAt: new Date(initialTime + WRITE_RATE_MS).toISOString(),
          updatedAt: new Date(initialTime + WRITE_RATE_MS).toISOString(),
        })
      })
    })

    it("patching will persist keeping the previous data", async () => {
      await config.doInTenant(async () => {
        const patch1 = generatePatchObject(2)
        const patch2 = generatePatchObject(2)
        await docWritethrough.patch(patch1)
        await docWritethrough.patch(patch2)

        travelForward(WRITE_RATE_MS)

        const patch3 = generatePatchObject(3)
        await docWritethrough.patch(patch3)

        travelForward(WRITE_RATE_MS)

        const patch4 = generatePatchObject(3)
        await docWritethrough.patch(patch4)

        expect(await db.get(documentId)).toEqual(
          expect.objectContaining({
            _id: documentId,
            ...patch1,
            ...patch2,
            ...patch3,
            ...patch4,
          })
        )
      })
    })

    it("date audit fields are set correctly when persisting", async () => {
      await config.doInTenant(async () => {
        const patch1 = generatePatchObject(2)
        const patch2 = generatePatchObject(2)
        await docWritethrough.patch(patch1)
        travelForward(WRITE_RATE_MS)
        const date1 = new Date()
        await docWritethrough.patch(patch2)

        travelForward(WRITE_RATE_MS)
        const date2 = new Date()

        const patch3 = generatePatchObject(3)
        await docWritethrough.patch(patch3)

        expect(date1).not.toEqual(date2)
        expect(await db.get(documentId)).toEqual(
          expect.objectContaining({
            createdAt: date1.toISOString(),
            updatedAt: date2.toISOString(),
          })
        )
      })
    })

    it("patching will not persist even if timeout hits but next patch is not callec", async () => {
      await config.doInTenant(async () => {
        await docWritethrough.patch(generatePatchObject(2))
        await docWritethrough.patch(generatePatchObject(2))

        travelForward(WRITE_RATE_MS)

        expect(await db.docExists(documentId)).toBe(false)
      })
    })

    it("concurrent patches will override keys", async () => {
      await config.doInTenant(async () => {
        const patch1 = generatePatchObject(2)
        await docWritethrough.patch(patch1)
        travelForward(WRITE_RATE_MS)
        const patch2 = generatePatchObject(1)
        await docWritethrough.patch(patch2)

        const keyToOverride = _.sample(Object.keys(patch1))!
        expect(await db.get(documentId)).toEqual(
          expect.objectContaining({
            [keyToOverride]: patch1[keyToOverride],
          })
        )

        travelForward(WRITE_RATE_MS)

        const patch3 = {
          ...generatePatchObject(3),
          [keyToOverride]: generator.word(),
        }
        await docWritethrough.patch(patch3)

        expect(await db.get(documentId)).toEqual(
          expect.objectContaining({
            ...patch1,
            ...patch2,
            ...patch3,
          })
        )
      })
    })

    it("concurrent patches to multiple DocWritethrough will not contaminate each other", async () => {
      await config.doInTenant(async () => {
        const secondDocWritethrough = new DocWritethrough(
          db,
          structures.db.id(),
          WRITE_RATE_MS
        )

        const doc1Patch = generatePatchObject(2)
        await docWritethrough.patch(doc1Patch)
        const doc2Patch = generatePatchObject(1)
        await secondDocWritethrough.patch(doc2Patch)

        travelForward(WRITE_RATE_MS)

        const doc1Patch2 = generatePatchObject(3)
        await docWritethrough.patch(doc1Patch2)
        const doc2Patch2 = generatePatchObject(3)
        await secondDocWritethrough.patch(doc2Patch2)

        expect(await db.get(docWritethrough.docId)).toEqual(
          expect.objectContaining({
            ...doc1Patch,
            ...doc1Patch2,
          })
        )

        expect(await db.get(secondDocWritethrough.docId)).toEqual(
          expect.objectContaining({
            ...doc2Patch,
            ...doc2Patch2,
          })
        )
      })
    })

    it("cached values are persisted only once", async () => {
      await config.doInTenant(async () => {
        const initialPatch = generatePatchObject(5)

        await docWritethrough.patch(initialPatch)
        travelForward(WRITE_RATE_MS)

        await docWritethrough.patch({})

        expect(await db.get(documentId)).toEqual(
          expect.objectContaining(initialPatch)
        )

        await db.remove(await db.get(documentId))

        travelForward(WRITE_RATE_MS)
        const extraPatch = generatePatchObject(5)
        await docWritethrough.patch(extraPatch)

        expect(await db.get(documentId)).toEqual(
          expect.objectContaining(extraPatch)
        )
        expect(await db.get(documentId)).not.toEqual(
          expect.objectContaining(initialPatch)
        )
      })
    })

    it("concurrent calls will not cause multiple saves", async () => {
      async function parallelPatch(count: number) {
        await Promise.all(
          Array.from({ length: count }).map(() =>
            docWritethrough.patch(generatePatchObject(1))
          )
        )
      }

      const persistToDbSpy = jest.spyOn(docWritethrough as any, "persistToDb")
      const storeToCacheSpy = jest.spyOn(docWritethrough as any, "storeToCache")

      await config.doInTenant(async () => {
        await parallelPatch(5)
        expect(persistToDbSpy).not.toBeCalled()
        expect(storeToCacheSpy).toBeCalledTimes(5)

        travelForward(WRITE_RATE_MS)

        await parallelPatch(40)

        expect(persistToDbSpy).toBeCalledTimes(1)
        expect(storeToCacheSpy).toBeCalledTimes(45)

        await parallelPatch(10)

        expect(persistToDbSpy).toBeCalledTimes(1)
        expect(storeToCacheSpy).toBeCalledTimes(55)

        travelForward(WRITE_RATE_MS)

        await parallelPatch(5)
        expect(persistToDbSpy).toBeCalledTimes(2)
        expect(storeToCacheSpy).toBeCalledTimes(60)
      })
    })
  })
})
