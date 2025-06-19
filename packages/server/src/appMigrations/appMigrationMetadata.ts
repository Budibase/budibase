import {
  DesignDocuments,
  Duration,
  cache,
  db,
  env,
} from "@budibase/backend-core"
import { Database, Document } from "@budibase/types"

export interface AppMigrationDoc extends Document {
  version: string
  history: Record<string, { runAt: string }>
}

const EXPIRY_SECONDS = Duration.fromDays(1).toSeconds()

async function getFromDB(appId: string) {
  return db.doWithDB(
    appId,
    (db: Database) => {
      return db.get<AppMigrationDoc>(DesignDocuments.MIGRATIONS)
    },
    { skip_setup: true }
  )
}

export const getAppMigrationCacheKey = (appId: string) =>
  `appmigrations_${env.VERSION}_${appId}`

export async function getAppMigrationVersion(appId: string): Promise<string> {
  const cacheKey = getAppMigrationCacheKey(appId)

  let version: string | undefined = await cache.get(cacheKey)
  if (version) {
    return version
  }

  const metadata = await getFromDB(appId)
  version = metadata?.version || ""

  // only cache if we have a valid version
  if (version) {
    await cache.store(cacheKey, version, EXPIRY_SECONDS)
  }

  return version
}

export async function updateAppMigrationMetadata({
  appId,
  version,
}: {
  appId: string
  version: string
}): Promise<void> {
  const appDb = db.getDB(appId)
  let appMigrationDoc = await getFromDB(appId)
  if (!appMigrationDoc) {
    appMigrationDoc = {
      _id: DesignDocuments.MIGRATIONS,
      version: "",
      history: {},
    }
  }

  const updatedMigrationDoc: AppMigrationDoc = {
    ...appMigrationDoc,
    version: version || "",
    history: {
      ...appMigrationDoc.history,
      [version]: { runAt: new Date().toISOString() },
    },
  }
  await appDb.put(updatedMigrationDoc)

  const cacheKey = getAppMigrationCacheKey(appId)
  await cache.destroy(cacheKey)
}
