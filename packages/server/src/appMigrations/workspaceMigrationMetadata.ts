import {
  DesignDocuments,
  Duration,
  cache,
  db,
  env,
} from "@budibase/backend-core"
import { Database, Document } from "@budibase/types"

export interface WorkspaceMigrationDoc extends Document {
  version: string
  initialVersion: string
  history: Record<string, { runAt: string }>
}

const EXPIRY_SECONDS = Duration.fromDays(1).toSeconds()

async function getFromDB(workspaceId: string) {
  return db.doWithDB(
    workspaceId,
    (db: Database) => {
      return db.get<WorkspaceMigrationDoc>(DesignDocuments.MIGRATIONS)
    },
    { skip_setup: true }
  )
}

export const getWorkspaceMigrationCacheKey = (workspaceId: string) =>
  `workspacemigrations_${env.VERSION}_${workspaceId}`

export async function getWorkspaceMigrationVersion(
  workspaceId: string
): Promise<string> {
  const cacheKey = getWorkspaceMigrationCacheKey(workspaceId)

  let version: string | undefined = await cache.get(cacheKey)

  // returned cached version if we found one
  if (version) {
    return version
  }

  try {
    const metadata = await getFromDB(workspaceId)
    version = metadata.version || ""
  } catch (err: any) {
    if (err.status !== 404) {
      throw err
    }

    version = ""
  }

  // only cache if we have a valid version
  if (version) {
    await cache.store(cacheKey, version, EXPIRY_SECONDS)
  }

  return version
}

export async function updateWorkspaceMigrationMetadata({
  workspaceId,
  version,
  skipHistory,
}: {
  workspaceId: string
  version: string
  skipHistory?: boolean
}): Promise<void> {
  const workspaceDb = db.getDB(workspaceId)
  let workspaceMigrationDoc: WorkspaceMigrationDoc

  try {
    workspaceMigrationDoc = await getFromDB(workspaceId)
  } catch (err: any) {
    if (err.status !== 404) {
      throw err
    }

    workspaceMigrationDoc = {
      _id: DesignDocuments.MIGRATIONS,
      version: "",
      initialVersion: version,
      history: {},
    }
    await workspaceDb.put(workspaceMigrationDoc)
    workspaceMigrationDoc = await getFromDB(workspaceId)
  }

  const updatedMigrationDoc: WorkspaceMigrationDoc = {
    ...workspaceMigrationDoc,
    version,
  }
  if (!skipHistory) {
    updatedMigrationDoc.history[version] = { runAt: new Date().toISOString() }
  }
  await workspaceDb.put(updatedMigrationDoc)

  const cacheKey = getWorkspaceMigrationCacheKey(workspaceId)

  await cache.destroy(cacheKey)
}
