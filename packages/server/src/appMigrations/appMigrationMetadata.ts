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
  initialVersion: string
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

  // returned cached version if we found one
  if (version) {
    return version
  }

  try {
    const metadata = await getFromDB(appId)
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

export async function updateAppMigrationMetadata({
  appId,
  version,
  skipHistory,
}: {
  appId: string
  version: string
  skipHistory?: boolean
}): Promise<void> {
  const appDb = db.getDB(appId)
  let appMigrationDoc: AppMigrationDoc

  try {
    appMigrationDoc = await getFromDB(appId)
  } catch (err: any) {
    if (err.status !== 404) {
      throw err
    }

    appMigrationDoc = {
      _id: DesignDocuments.MIGRATIONS,
      version: "",
      initialVersion: version,
      history: {},
    }
    await appDb.put(appMigrationDoc)
    appMigrationDoc = await getFromDB(appId)
  }

  const updatedMigrationDoc: AppMigrationDoc = {
    ...appMigrationDoc,
    version,
  }
  if (!skipHistory) {
    updatedMigrationDoc.history[version] = { runAt: new Date().toISOString() }
  }
  await appDb.put(updatedMigrationDoc)

  const cacheKey = getAppMigrationCacheKey(appId)

  await cache.destroy(cacheKey)
}
