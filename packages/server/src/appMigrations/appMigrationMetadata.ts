import { Duration, cache, db, env } from "@budibase/backend-core"
import { Database, App, DocumentType, Document } from "@budibase/types"

export interface AppMigrationDoc extends Document {
  version: string
}

const EXPIRY_SECONDS = Duration.fromDays(1).toSeconds()

async function populateFromDB(appId: string) {
  return db.doWithDB(
    appId,
    (db: Database) => {
      return db.get<App>(DocumentType.APP_MIGRATION_METADATA)
    },
    { skip_setup: true }
  )
}

export async function getAppMigrationMetadata(appId: string): Promise<string> {
  const cacheKey = `appmigrations_${env.VERSION}_${appId}`

  let metadata: AppMigrationDoc | undefined = await cache.get(cacheKey)
  if (!metadata || env.isDev()) {
    try {
      metadata = await populateFromDB(appId)
    } catch (err: any) {
      if (err.status !== 404) {
        throw err
      }

      metadata = { version: "" }
    }

    await cache.store(cacheKey, metadata, EXPIRY_SECONDS)
  }

  return metadata.version
}
