import { context, db } from "@budibase/backend-core"
import { RuntimeDocumentTypes, SEPARATOR } from "@budibase/types"
import fs from "fs"
import os from "os"
import path from "path"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { DB_EXPORT_FILE } from "./constants"
import { exportDB } from "./exports"
import { importApp } from "./imports"

describe("importApp", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init()
  })

  afterAll(() => {
    config.end()
  })

  it("drops runtime documents carried by older exports", async () => {
    const sourceWorkspaceId = config.getDevWorkspaceId()
    const runtimeDocIds = RuntimeDocumentTypes.map(
      type => `${type}${SEPARATOR}imported`
    )
    await config.doInContext(sourceWorkspaceId, () =>
      context.getWorkspaceDB().bulkDocs(runtimeDocIds.map(_id => ({ _id })))
    )
    // an unfiltered dump, as exports were before these docs were excluded
    const exportDir = fs.mkdtempSync(path.join(os.tmpdir(), "bb-import-"))
    await exportDB(sourceWorkspaceId, {
      exportPath: path.join(exportDir, DB_EXPORT_FILE),
    })

    const { appId: targetWorkspaceId } = await config.api.workspace.create({
      name: "Runtime documents import",
    })
    try {
      await config.doInContext(targetWorkspaceId, () =>
        importApp(
          targetWorkspaceId,
          db.getDB(targetWorkspaceId),
          { file: { path: exportDir } },
          { updateAttachmentColumns: false, importObjStoreContents: false }
        )
      )
    } finally {
      fs.rmSync(exportDir, { recursive: true, force: true })
    }

    const imported = await db
      .getDB(targetWorkspaceId)
      .getMultiple(runtimeDocIds, { allowMissing: true })
    expect(imported).toEqual([])
  })
})
