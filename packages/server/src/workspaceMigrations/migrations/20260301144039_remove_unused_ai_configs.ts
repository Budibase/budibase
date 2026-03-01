import { configs, context, db } from "@budibase/backend-core"
import { ConfigType } from "@budibase/types"
import { getWorkspaceMigrationVerions } from "../workspaceMigrationMetadata"

const SOURCE_MIGRATION_ID = "20260227144312_unify_ai_configs"
const SOURCE_MIGRATION_TIMESTAMP = Number.parseInt(
  SOURCE_MIGRATION_ID.split("_")[0],
  10
)

const hasSourceMigrationOrLater = (version: string) => {
  if (version === SOURCE_MIGRATION_ID) {
    return true
  }

  const versionTimestamp = Number.parseInt(version.split("_")[0], 10)
  return (
    !Number.isNaN(versionTimestamp) &&
    versionTimestamp >= SOURCE_MIGRATION_TIMESTAMP
  )
}

const migration = async () => {
  const workspaceIds = await db.getAllWorkspaces({ idsOnly: true })
  if (workspaceIds.length === 0) {
    return
  }

  const migrationVersions = await Promise.all(
    workspaceIds.map(workspaceId => getWorkspaceMigrationVerions(workspaceId))
  )
  if (!migrationVersions.every(hasSourceMigrationOrLater)) {
    return
  }

  const globalDb = context.getGlobalDB()
  const configId = configs.generateConfigID(ConfigType.AI)
  const legacyConfig = await globalDb.tryGet(configId)
  if (!legacyConfig) {
    return
  }

  try {
    await globalDb.remove(legacyConfig)
  } catch (err: any) {
    if (err?.status !== 404) {
      throw err
    }
  }
}

export default migration
