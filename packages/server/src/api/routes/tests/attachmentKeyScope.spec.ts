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
})
