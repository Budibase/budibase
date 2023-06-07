import newid from "../../db/newid"

const attachment = {
  size: 73479,
  name: "2022-12-14 11_11_44-.png",
  url: "/prod-budi-app-assets/app_bbb/attachments/a.png",
  extension: "png",
  key: "app_bbb/attachments/a.png",
}

const row = {
  _id: "ro_ta_aaa",
  photo: [attachment],
  otherCol: "string",
}

const table = {
  _id: "ta_aaa",
  name: "photos",
  schema: {
    photo: {
      type: "attachment",
      name: "photo",
    },
    otherCol: {
      type: "string",
      name: "otherCol",
    },
  },
}

jest.mock("@budibase/backend-core", () => {
  const core = jest.requireActual("@budibase/backend-core")
  return {
    ...core,
    db: {
      ...core.db,
      directCouchFind: jest.fn(),
    },
  }
})

import { db as dbCore } from "@budibase/backend-core"
import sdk from "../index"

describe("should be able to re-write attachment URLs", () => {
  it("it should update URLs on a number of rows over the limit", async () => {
    const db = dbCore.getDB("app_aaa")
    await db.put(table)
    const limit = 30
    let rows = []
    for (let i = 0; i < limit; i++) {
      const rowToWrite = {
        ...row,
        _id: `${row._id}_${newid()}`,
      }
      const { rev } = await db.put(rowToWrite)
      rows.push({
        ...rowToWrite,
        _rev: rev,
      })
    }

    dbCore.directCouchFind
      // @ts-ignore
      .mockReturnValueOnce({ rows: rows.slice(0, 25), bookmark: "aaa" })
      .mockReturnValueOnce({ rows: rows.slice(25, limit), bookmark: "bbb" })
    await sdk.backups.updateAttachmentColumns(db.name, db)
    const finalRows = await sdk.rows.getAllInternalRows(db.name)
    for (let rowToCheck of finalRows) {
      expect(rowToCheck.otherCol).toBe(row.otherCol)
      expect(rowToCheck.photo[0].url).toBe("")
      expect(rowToCheck.photo[0].key).toBe(`${db.name}/attachments/a.png`)
    }
  })
})
