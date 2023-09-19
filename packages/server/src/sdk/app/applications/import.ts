import { db as dbCore } from "@budibase/backend-core"
import backups from "../backups"

export type FileAttributes = {
  type: string
  path: string
}

export async function updateWithExport(
  appId: string,
  file: FileAttributes,
  password?: string
) {
  const devId = dbCore.getDevAppID(appId)
  // TEMPORARY BEGIN
  const appDb = dbCore.getDB(devId)
  await appDb.destroy()
  // TEMPORARY END
  // const tempAppName = `temp_${devId}`
  // const tempDb = dbCore.getDB(tempAppName)
  const template = {
    file: {
      type: file.type!,
      path: file.path!,
      password,
    },
  }
  await backups.importApp(devId, appDb, template)
}
