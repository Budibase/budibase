import tk from "timekeeper"

import _ from "lodash"
import {
  DBTestConfiguration,
  generator,
  structures,
  utils,
} from "../../../tests"
import { getDB } from "../../db"

import {
  DocWritethrough,
  DocWritethroughProcessor,
  init,
} from "../docWritethrough"

const initialTime = Date.now()

async function waitForQueueCompletion() {
  await utils.queue.processMessages(DocWritethroughProcessor.queue)
}

beforeAll(() => utils.queue.useRealQueues())

describe("docWritethrough", () => {
  beforeAll(() => {
    init()
  })

  const config = new DBTestConfiguration()

  const db = getDB(structures.db.id())
  let documentId: string
  let docWritethrough: DocWritethrough

  describe("patch", () => {
    function generatePatchObject(fieldCount: number) {
      const keys = generator.unique(() => generator.guid(), fieldCount)
      return keys.reduce((acc, c) => {
        acc[c] = generator.word()
        return acc
      }, {} as Record<string, any>)
    }

    beforeEach(async () => {
      jest.clearAllMocks()
      documentId = structures.uuid()
      docWritethrough = new DocWritethrough(db, documentId)
    })

    it("patching will not persist until the messages are persisted", async () => {
      await config.doInTenant(async () => {
        await docWritethrough.patch(generatePatchObject(2))
        await docWritethrough.patch(generatePatchObject(2))

        expect(await db.exists(documentId)).toBe(false)
      })
    })

    it("patching will persist when the messages are persisted", async () => {
      await config.doInTenant(async () => {
        const patch1 = generatePatchObject(2)
        const patch2 = generatePatchObject(2)
        await docWritethrough.patch(patch1)
        await docWritethrough.patch(patch2)

        await waitForQueueCompletion()

        // This will not be persisted
        const patch3 = generatePatchObject(3)
        await docWritethrough.patch(patch3)

        expect(await db.tryGet(documentId)).toEqual({
          _id: documentId,
          ...patch1,
          ...patch2,
          _rev: expect.stringMatching(/2-.+/),
          createdAt: new Date(initialTime).toISOString(),
          updatedAt: new Date(initialTime).toISOString(),
        })
      })
    })

    it("patching will persist keeping the previous data", async () => {
      await config.doInTenant(async () => {
        const patch1 = generatePatchObject(2)
        const patch2 = generatePatchObject(2)
        await docWritethrough.patch(patch1)
        await docWritethrough.patch(patch2)

        await waitForQueueCompletion()

        const patch3 = generatePatchObject(3)
        await docWritethrough.patch(patch3)

        await waitForQueueCompletion()

        expect(await db.tryGet(documentId)).toEqual(
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
        const date1 = new Date()
        await waitForQueueCompletion()
        await docWritethrough.patch(patch2)

        tk.travel(Date.now() + 100)
        const date2 = new Date()
        await waitForQueueCompletion()

        expect(date1).not.toEqual(date2)
        expect(await db.tryGet(documentId)).toEqual(
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
        await waitForQueueCompletion()
        const patch2 = generatePatchObject(1)
        await docWritethrough.patch(patch2)

        const keyToOverride = _.sample(Object.keys(patch1))!
        expect(await db.tryGet(documentId)).toEqual(
          expect.objectContaining({
            [keyToOverride]: patch1[keyToOverride],
          })
        )

        await waitForQueueCompletion()

        const patch3 = {
          ...generatePatchObject(3),
          [keyToOverride]: generator.word(),
        }
        await docWritethrough.patch(patch3)
        await waitForQueueCompletion()

        expect(await db.tryGet(documentId)).toEqual(
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
          structures.db.id()
        )

        const doc1Patch = generatePatchObject(2)
        await docWritethrough.patch(doc1Patch)
        const doc2Patch = generatePatchObject(1)
        await secondDocWritethrough.patch(doc2Patch)

        await waitForQueueCompletion()

        const doc1Patch2 = generatePatchObject(3)
        await docWritethrough.patch(doc1Patch2)
        const doc2Patch2 = generatePatchObject(3)
        await secondDocWritethrough.patch(doc2Patch2)
        await waitForQueueCompletion()

        expect(await db.tryGet(docWritethrough.docId)).toEqual(
          expect.objectContaining({
            ...doc1Patch,
            ...doc1Patch2,
          })
        )

        expect(await db.tryGet(secondDocWritethrough.docId)).toEqual(
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
        await waitForQueueCompletion()

        expect(await db.tryGet(documentId)).toEqual(
          expect.objectContaining(initialPatch)
        )

        await db.remove(await db.get(documentId))

        await waitForQueueCompletion()
        const extraPatch = generatePatchObject(5)
        await docWritethrough.patch(extraPatch)
        await waitForQueueCompletion()

        expect(await db.tryGet(documentId)).toEqual(
          expect.objectContaining(extraPatch)
        )
        expect(await db.tryGet(documentId)).not.toEqual(
          expect.objectContaining(initialPatch)
        )
      })
    })

    it("concurrent calls will not cause conflicts", async () => {
      async function parallelPatch(count: number) {
        const patches = Array.from({ length: count }).map(() =>
          generatePatchObject(1)
        )
        await Promise.all(patches.map(p => docWritethrough.patch(p)))

        return patches.reduce((acc, c) => {
          acc = { ...acc, ...c }
          return acc
        }, {})
      }
      const queueMessageSpy = jest.spyOn(DocWritethroughProcessor.queue, "add")

      await config.doInTenant(async () => {
        let patches = await parallelPatch(5)
        expect(queueMessageSpy).toHaveBeenCalledTimes(5)

        await waitForQueueCompletion()
        expect(await db.tryGet(documentId)).toEqual(
          expect.objectContaining(patches)
        )

        patches = { ...patches, ...(await parallelPatch(40)) }
        expect(queueMessageSpy).toHaveBeenCalledTimes(45)

        await waitForQueueCompletion()
        expect(await db.tryGet(documentId)).toEqual(
          expect.objectContaining(patches)
        )

        patches = { ...patches, ...(await parallelPatch(10)) }
        expect(queueMessageSpy).toHaveBeenCalledTimes(55)

        await waitForQueueCompletion()
        expect(await db.tryGet(documentId)).toEqual(
          expect.objectContaining(patches)
        )
      })
    })

    it("patches will execute in order", async () => {
      let incrementalValue = 0
      const keyToOverride = generator.word()
      async function incrementalPatches(count: number) {
        for (let i = 0; i < count; i++) {
          await docWritethrough.patch({ [keyToOverride]: ++incrementalValue })
        }
      }

      await config.doInTenant(async () => {
        await incrementalPatches(5)

        await waitForQueueCompletion()
        expect(await db.tryGet(documentId)).toEqual(
          expect.objectContaining({ [keyToOverride]: 5 })
        )

        await incrementalPatches(40)
        await waitForQueueCompletion()
        expect(await db.tryGet(documentId)).toEqual(
          expect.objectContaining({ [keyToOverride]: 45 })
        )
      })
    })
  })
})
