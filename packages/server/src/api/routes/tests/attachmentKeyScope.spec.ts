import { context } from "@budibase/backend-core"
import { FieldType, type RowAttachment } from "@budibase/types"
import sdk from "../../../sdk"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { basicTableWithAttachmentField } from "../../../tests/utilities/structures"

describe("attachment key ownership", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => config.end())

  it("accepts this workspace's keys and rejects a foreign workspace key", async () => {
    const table = await config.api.table.save(basicTableWithAttachmentField())
    const attachment = {
      name: "file.txt",
      extension: "txt",
      size: 1,
    }

    await config.api.row.save(
      table._id!,
      {
        file_attachment: [
          { ...attachment, key: "app_other/attachments/foreign.txt" },
        ],
      },
      { status: 400 }
    )
    await config.api.row.save(
      table._id!,
      {
        file_attachment: [
          {
            ...attachment,
            key: `${config.getProdWorkspaceId()}/attachments/%2e%2e`,
          },
        ],
      },
      { status: 400 }
    )

    const key = `${config.getProdWorkspaceId()}/attachments/own.txt`
    const row = await config.api.row.save(table._id!, {
      file_attachment: [{ ...attachment, key }],
    })
    expect(row.file_attachment[0].key).toEqual(key)
  })
  it.each([
    {
      type: FieldType.ATTACHMENTS as const,
      wrap: (attachment: RowAttachment) => [attachment],
    },
    {
      type: FieldType.ATTACHMENT_SINGLE as const,
      wrap: (attachment: RowAttachment) => attachment,
    },
    {
      type: FieldType.SIGNATURE_SINGLE as const,
      wrap: (attachment: RowAttachment) => attachment,
    },
  ])("allows editing a row with a legacy $type key", async ({ type, wrap }) => {
    const attachment = {
      key: "app_other/attachments/legacy.txt",
      name: "legacy.txt",
      size: 1,
      extension: "txt",
    }
    const value = wrap(attachment)
    const table = await config.api.table.save(
      basicTableWithAttachmentField(undefined, {
        schema: {
          legacy: { name: "legacy", type },
          name: { name: "name", type: FieldType.STRING },
          upload: { name: "upload", type: FieldType.ATTACHMENTS },
        },
      })
    )
    const row = await config.api.row.save(table._id!, { name: "before" })
    await config.doInContext(config.getDevWorkspaceId(), async () => {
      await context.getWorkspaceDB().put({ ...row, legacy: value })
    })
    const updated = await config.api.row.patch(table._id!, {
      _id: row._id!,
      _rev: row._rev!,
      tableId: table._id!,
      name: "after",
      legacy: value,
      upload: [
        {
          key: `${config.getProdWorkspaceId()}/attachments/new.txt`,
          name: "new.txt",
          size: 1,
          extension: "txt",
        },
      ],
    })
    expect(updated.name).toBe("after")
    expect(updated.legacy).toEqual(value)
    expect(updated.upload[0].key).toBe(
      `${config.getProdWorkspaceId()}/attachments/new.txt`
    )

    const saved = await config.doInContext(config.getDevWorkspaceId(), () =>
      sdk.rows.save(table._id!, { ...updated, name: "saved" }, undefined)
    )
    expect(saved.row.name).toBe("saved")
    expect(saved.row.legacy).toEqual(value)

    await config.api.row.patch(
      table._id!,
      {
        _id: row._id!,
        _rev: saved.row._rev!,
        tableId: table._id!,
        legacy: wrap({
          ...attachment,
          key: "app_other/attachments/new-foreign.txt",
        }),
      },
      { status: 400 }
    )

    await config.api.row.patch(
      table._id!,
      {
        _id: row._id!,
        _rev: updated._rev!,
        tableId: table._id!,
        upload: [
          {
            key: "app_other/attachments/legacy.txt",
            name: "legacy.txt",
            size: 1,
            extension: "txt",
          },
        ],
      },
      { status: 400 }
    )
  })
})
