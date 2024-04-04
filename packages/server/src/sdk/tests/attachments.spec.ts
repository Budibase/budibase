import TestConfig from "../../tests/utilities/TestConfiguration"
import { db as dbCore } from "@budibase/backend-core"
import sdk from "../index"
import {
  FieldType,
  INTERNAL_TABLE_SOURCE_ID,
  TableSourceType,
} from "@budibase/types"
import { FIND_LIMIT } from "../app/rows/attachments"

const attachment = {
  size: 73479,
  name: "2022-12-14 11_11_44-.png",
  url: "/prod-budi-app-assets/app_bbb/attachments/a.png",
  extension: "png",
  key: "app_bbb/attachments/a.png",
}

describe("should be able to re-write attachment URLs", () => {
  const config = new TestConfig()

  beforeAll(async () => {
    await config.init()
  })

  it("should update URLs on a number of rows over the limit", async () => {
    const table = await config.api.table.save({
      name: "photos",
      type: "table",
      sourceId: INTERNAL_TABLE_SOURCE_ID,
      sourceType: TableSourceType.INTERNAL,
      schema: {
        photo: {
          type: FieldType.ATTACHMENTS,
          name: "photo",
        },
        otherCol: {
          type: FieldType.STRING,
          name: "otherCol",
        },
      },
    })

    for (let i = 0; i < FIND_LIMIT * 4; i++) {
      await config.api.row.save(table._id!, {
        photo: [attachment],
        otherCol: "string",
      })
    }

    const db = dbCore.getDB(config.getAppId())
    await sdk.backups.updateAttachmentColumns(db.name, db)

    const rows = (await sdk.rows.getAllInternalRows(db.name)).filter(
      row => row.tableId === table._id
    )
    for (const row of rows) {
      expect(row.otherCol).toBe("string")
      expect(row.photo[0].url).toBe("")
      expect(row.photo[0].key).toBe(`${db.name}/attachments/a.png`)
    }
  })
})
