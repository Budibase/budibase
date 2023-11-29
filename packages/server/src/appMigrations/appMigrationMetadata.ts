import { Duration, cache, context, db, env } from "@budibase/backend-core"
import { Database, DocumentType, Document } from "@budibase/types"

export interface AppMigrationDoc extends Document {
  version: string
  history: Record<string, { runAt: number }>
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

export async function getAppMigrationMetadata(appId: string): Promise<string> {
  const cacheKey = getCacheKey(appId)

  let metadata: AppMigrationDoc | undefined = await cache.get(cacheKey)
  if (!metadata || env.isDev()) {
    try {
      metadata = await getFromDB(appId)
    } catch (err: any) {
      if (err.status !== 404) {
        throw err
      }

      metadata = { version: "", history: {} }
    }

    await cache.store(cacheKey, metadata, EXPIRY_SECONDS)
  }

  return metadata.version
}

export async function updateAppMigrationMetadata({
  appId,
  version,
}: {
  appId: string
  version: string
}): Promise<void> {
  const db = context.getAppDB()
  const appMigrationDoc = await getFromDB(appId)
  const updatedMigrationDoc: AppMigrationDoc = {
    ...appMigrationDoc,
    version,
    history: {
      ...appMigrationDoc.history,
      [version]: { runAt: Date.now() },
    },
  }
  await db.put(updatedMigrationDoc)

  const cacheKey = getCacheKey(appId)

  await cache.destroy(cacheKey)
}
