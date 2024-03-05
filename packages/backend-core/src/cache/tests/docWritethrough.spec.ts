import { DBTestConfiguration, generator, structures } from "../../../tests"
import { getDB } from "../../db"
import _ from "lodash"

import {
  DocWritethrough,
  docWritethroughProcessorQueue,
} from "../docWritethrough"
import InMemoryQueue from "../../queue/inMemoryQueue"

const WRITE_RATE_MS = 1000

const initialTime = Date.now()

jest.useFakeTimers({
  now: initialTime,
})

function resetTime() {
  jest.setSystemTime(initialTime)
}
async function travelForward(ms: number) {
  await jest.advanceTimersByTimeAsync(ms)

  const queue: InMemoryQueue = docWritethroughProcessorQueue as never
  while (queue.hasRunningJobs()) {
    await jest.runOnlyPendingTimersAsync()
  }
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

    beforeEach(async () => {
      resetTime()
      documentId = structures.uuid()
      docWritethrough = new DocWritethrough(db, documentId, WRITE_RATE_MS)
    })

    it("patching will not persist if timeout does not hit", async () => {
      await config.doInTenant(async () => {
        await travelForward(WRITE_RATE_MS)
        await docWritethrough.patch(generatePatchObject(2))
        await docWritethrough.patch(generatePatchObject(2))
        await travelForward(WRITE_RATE_MS - 1)

        expect(await db.exists(documentId)).toBe(false)
      })
    })

    it("patching will persist if timeout hits", async () => {
      await config.doInTenant(async () => {
        const patch1 = generatePatchObject(2)
        const patch2 = generatePatchObject(2)
        await docWritethrough.patch(patch1)
        await docWritethrough.patch(patch2)

        await travelForward(WRITE_RATE_MS)

        // This will not be persisted
        const patch3 = generatePatchObject(3)
        await docWritethrough.patch(patch3)

        expect(await db.get(documentId)).toEqual({
          _id: documentId,
          ...patch1,
          ...patch2,
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

        await travelForward(WRITE_RATE_MS)

        const patch3 = generatePatchObject(3)
        await docWritethrough.patch(patch3)

        await travelForward(WRITE_RATE_MS)

        expect(await db.get(documentId)).toEqual(
          expect.objectContaining({
            _id: documentId,
            ...patch1,
            ...patch2,
            ...patch3,
          })
        )
      })
    })

    it("date audit fields are set correctly when persisting", async () => {
      await config.doInTenant(async () => {
        const patch1 = generatePatchObject(2)
        const patch2 = generatePatchObject(2)
        await docWritethrough.patch(patch1)
        await travelForward(WRITE_RATE_MS)
        const date1 = new Date()
        await docWritethrough.patch(patch2)

        await travelForward(WRITE_RATE_MS)
        const date2 = new Date()

        expect(date1).not.toEqual(date2)
        expect(await db.get(documentId)).toEqual(
          expect.objectContaining({
            createdAt: date1.toISOString(),
            updatedAt: date2.toISOString(),
          })
        )
      })
    })

    it("concurrent patches will override keys", async () => {
      await config.doInTenant(async () => {
        const patch1 = generatePatchObject(2)
        await docWritethrough.patch(patch1)
        await travelForward(WRITE_RATE_MS)
        const patch2 = generatePatchObject(1)
        await docWritethrough.patch(patch2)

        const keyToOverride = _.sample(Object.keys(patch1))!
        expect(await db.get(documentId)).toEqual(
          expect.objectContaining({
            [keyToOverride]: patch1[keyToOverride],
          })
        )

        await travelForward(WRITE_RATE_MS)

        const patch3 = {
          ...generatePatchObject(3),
          [keyToOverride]: generator.word(),
        }
        await docWritethrough.patch(patch3)
        await travelForward(WRITE_RATE_MS)

        expect(await db.get(documentId)).toEqual(
          expect.objectContaining({
            ...patch1,
            ...patch2,
            ...patch3,
          })
        )
      })
    })

    it("concurrent patches to different docWritethrough will not pollute each other", async () => {
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

        await travelForward(WRITE_RATE_MS)

        const doc1Patch2 = generatePatchObject(3)
        await docWritethrough.patch(doc1Patch2)
        const doc2Patch2 = generatePatchObject(3)
        await secondDocWritethrough.patch(doc2Patch2)
        await travelForward(WRITE_RATE_MS)

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
        await travelForward(WRITE_RATE_MS)

        await docWritethrough.patch({})

        expect(await db.get(documentId)).toEqual(
          expect.objectContaining(initialPatch)
        )

        await db.remove(await db.get(documentId))

        await travelForward(WRITE_RATE_MS)
        const extraPatch = generatePatchObject(5)
        await docWritethrough.patch(extraPatch)
        await travelForward(WRITE_RATE_MS)

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

      const storeToCacheSpy = jest.spyOn(docWritethrough as any, "storeToCache")

      await config.doInTenant(async () => {
        await parallelPatch(5)
        expect(storeToCacheSpy).toBeCalledTimes(5)
        expect(await db.exists(documentId)).toBe(false)

        await travelForward(WRITE_RATE_MS)

        await parallelPatch(40)

        expect(storeToCacheSpy).toBeCalledTimes(45)

        // Ideally we want to spy on persistToDb from ./docWritethrough, but due our barrel files configuration required quite of a complex setup.
        // We are relying on the document being stored only once (otherwise we would have _rev updated)
        expect(await db.get(documentId)).toEqual(
          expect.objectContaining({
            _id: documentId,
            _rev: expect.stringMatching(/1-.+/),
          })
        )

        await parallelPatch(10)

        expect(storeToCacheSpy).toBeCalledTimes(55)
        expect(await db.get(documentId)).toEqual(
          expect.objectContaining({
            _id: documentId,
            _rev: expect.stringMatching(/1-.+/),
          })
        )

        await travelForward(WRITE_RATE_MS)

        await parallelPatch(5)
        await travelForward(WRITE_RATE_MS)
        expect(await db.get(documentId)).toEqual(
          expect.objectContaining({
            _id: documentId,
            _rev: expect.stringMatching(/3-.+/),
          })
        )
        expect(storeToCacheSpy).toBeCalledTimes(60)
      })
    })
  })
})
