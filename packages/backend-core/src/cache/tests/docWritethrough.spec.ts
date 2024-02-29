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

    it("patching will not persist until timeout is hit", async () => {
      await config.doInTenant(async () => {
        await docWritethrough.patch(generatePatchObject(2))
        await docWritethrough.patch(generatePatchObject(2))
        tk.travel(Date.now() + WRITE_RATE_MS - 1)
        await docWritethrough.patch(generatePatchObject(2))

        expect(await db.docExists(documentId)).toBe(false)
      })
    })
  })
})
