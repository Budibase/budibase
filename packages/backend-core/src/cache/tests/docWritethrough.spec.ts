import tk from "timekeeper"
import { env } from "../.."
import { DBTestConfiguration, generator, structures } from "../../../tests"
import { getDB } from "../../db"
import { DocWritethrough } from "../docWritethrough"
import _ from "lodash"

env._set("MOCK_REDIS", null)

const initialTime = Date.now()

const WRITE_RATE_MS = 500

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
      tk.freeze(initialTime)
      documentId = structures.db.id()
      docWritethrough = new DocWritethrough(db, documentId, WRITE_RATE_MS)
    })

    it("patching will not persist if timeout does not hit", async () => {
      await config.doInTenant(async () => {
        await docWritethrough.patch(generatePatchObject(2))
        await docWritethrough.patch(generatePatchObject(2))
        tk.travel(Date.now() + WRITE_RATE_MS - 1)
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

        tk.travel(Date.now() + WRITE_RATE_MS)

        const patch3 = generatePatchObject(3)
        await docWritethrough.patch(patch3)

        expect(await db.get(documentId)).toEqual({
          _id: documentId,
          ...patch1,
          ...patch2,
          ...patch3,
          _rev: expect.stringMatching(/1-.+/),
          createdAt: new Date(initialTime + 500).toISOString(),
          updatedAt: new Date(initialTime + 500).toISOString(),
        })
      })
    })

    it("patching will not persist even if timeout hits but next patch is not callec", async () => {
      await config.doInTenant(async () => {
        const patch1 = generatePatchObject(2)
        const patch2 = generatePatchObject(2)
        await docWritethrough.patch(patch1)
        await docWritethrough.patch(patch2)

        tk.travel(Date.now() + WRITE_RATE_MS)

        expect(await db.docExists(documentId)).toBe(false)
      })
    })
  })
})
