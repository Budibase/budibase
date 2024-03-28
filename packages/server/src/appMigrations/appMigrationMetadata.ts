import { Duration, cache, context, db, env } from "@budibase/backend-core"
import { Database, DocumentType, Document } from "@budibase/types"

export interface AppMigrationDoc extends Document {
  version: string
  history: Record<string, { runAt: string }>
}

const EXPIRY_SECONDS = Duration.fromDays(1).toSeconds()

async function getFromDB(appId: string) {
  return db.doWithDB(
    appId,
    (db: Database) => {
      return db.get<AppMigrationDoc>(DocumentType.APP_MIGRATION_METADATA)
    },
    { skip_setup: true }
  )
}

const getCacheKey = (appId: string) => `appmigrations_${env.VERSION}_${appId}`

export async function getAppMigrationVersion(appId: string): Promise<string> {
  const cacheKey = getCacheKey(appId)

  let metadata: AppMigrationDoc | undefined = await cache.get(cacheKey)

  // We don't want to cache in dev, in order to be able to tweak it
  if (metadata && !env.isDev()) {
    return metadata.version
  }

  let version
  try {
    metadata = await getFromDB(appId)
    version = metadata.version || ""
  } catch (err: any) {
    if (err.status !== 404) {
      throw err
    }

    version = ""
  }

  await cache.store(cacheKey, version, EXPIRY_SECONDS)

  return version
}

export async function updateAppMigrationMetadata({
  appId,
  version,
}: {
  appId: string
  version: string
}): Promise<void> {
  const db = context.getAppDB()

  let appMigrationDoc: AppMigrationDoc

  try {
    appMigrationDoc = await getFromDB(appId)
  } catch (err: any) {
    if (err.status !== 404) {
      throw err
    }

    appMigrationDoc = {
      _id: DocumentType.APP_MIGRATION_METADATA,
      version: "",
      history: {},
    }
    await db.put(appMigrationDoc)
    appMigrationDoc = await getFromDB(appId)
  }

  const updatedMigrationDoc: AppMigrationDoc = {
    ...appMigrationDoc,
    version: version || "",
    history: {
      ...appMigrationDoc.history,
      [version]: { runAt: new Date().toISOString() },
    },
  }
  await db.put(updatedMigrationDoc)

  const cacheKey = getCacheKey(appId)

  await cache.destroy(cacheKey)
}
