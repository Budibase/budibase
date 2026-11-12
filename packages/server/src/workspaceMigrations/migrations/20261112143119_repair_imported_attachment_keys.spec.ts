import { context, objectStore } from "@budibase/backend-core"
import { FieldType, type Row } from "@budibase/types"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import { basicTable } from "../../tests/utilities/structures"
import migration from "./20261112143119_repair_imported_attachment_keys"

const config = new TestConfiguration()

describe("repair imported attachment keys", () => {
  beforeAll(() => config.init())
  afterAll(() => config.end())

  it.each(["dev", "prod"])(
    "repairs only keys with a safe destination file in %s",
    async mode => {
      const table = await config.api.table.save(
        basicTable(undefined, {
          schema: {
            files: { name: "files", type: FieldType.ATTACHMENTS },
            file: { name: "file", type: FieldType.ATTACHMENT_SINGLE },
            signature: {
              name: "signature",
              type: FieldType.SIGNATURE_SINGLE,
            },
          },
        })
      )
      await config.publish()
      const prodId = config.getProdWorkspaceId()
      await objectStore.upload({
        bucket: objectStore.ObjectStoreBuckets.APPS,
        filename: `${prodId}/attachments/copied.txt`,
        body: Buffer.from("copied attachment"),
        type: "text/plain",
      })
      const workspaceId = mode === "dev" ? config.getDevWorkspaceId() : prodId
      await config.doInContext(workspaceId, async () => {
        const db = context.getWorkspaceDB()
        const attachment = {
          name: "file.txt",
          size: 1,
          extension: "txt",
          url: "https://example.com/old",
        }
        const row: Row = {
          _id: `ro_${table._id}_legacy`,
          tableId: table._id,
          files: [
            { ...attachment, key: "app_source/attachments/copied.txt" },
            { ...attachment, key: "app_source/attachments/missing.txt" },
            { ...attachment, key: "app_source/attachments/%2e%2e" },
          ],
          file: { ...attachment, key: "app_source/attachments/copied.txt" },
          signature: {
            ...attachment,
            key: "app_source/attachments/copied.txt",
          },
        }
        await db.put(row)
        await migration()
        const repaired = await db.get<Row>(row._id!)
        await migration()
        expect(await db.get(row._id!)).toEqual(repaired)
        expect(repaired.files.map((file: { key: string }) => file.key)).toEqual(
          [
            `${prodId}/attachments/copied.txt`,
            "app_source/attachments/missing.txt",
            "app_source/attachments/%2e%2e",
          ]
        )
        expect(repaired.file.key).toBe(`${prodId}/attachments/copied.txt`)
        expect(repaired.signature.key).toBe(`${prodId}/attachments/copied.txt`)
        expect(repaired.file.url).toBeUndefined()
      })
    }
  )
})
