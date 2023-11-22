import { context, locks, queue } from "@budibase/backend-core"
import { UserCtx, Document, LockName, LockType } from "@budibase/types"
import Bull, { Job } from "bull"

const MIGRATIONS: Record<
  string,
  { migration: () => Promise<void>; blocking: boolean }
> = {
  "20231122115100": {
    migration: async () => {
      console.error("a")
    },
    blocking: false,
  },
  "20231122115532": {
    migration: async () => {
      console.error("b")
    },
    blocking: true,
  },
}

interface MigrationDoc extends Document {
  version: string
}

const appQueues: Record<string, Bull.Queue<any>> = {}

async function processMessage(job: Job) {
  const message = job.data
  await MIGRATIONS[message.migrationId].migration()
}

export default async (ctx: UserCtx, next: any) => {
  if (!ctx.appId) {
    return next()
  }

  const { appId } = ctx

  const db = context.getAppDB()
  let migrationDoc: MigrationDoc = { version: "" }
  try {
    migrationDoc = await db.get<MigrationDoc>("_migrations")
  } catch (e: any) {
    if (e.status !== 404) {
      throw e
    }
  }

  const currentMigration = migrationDoc.version || ""

  const migrationKeys = Object.keys(MIGRATIONS)

  const pendingMigrations = migrationKeys.filter(m => m > currentMigration)

  let appQueue = appQueues[appId]
  if (!appQueue) {
    await locks.doWithLock(
      {
        name: LockName.APP_MIGRATION,
        type: LockType.TRY_TWICE,
        resource: appId,
        ttl: 150,
      },
      async () => {
        if (appQueues[appId]) {
          return
        }
        appQueues[appId] = queue.createQueue(appId)
        appQueue = appQueues[appId]
        appQueue.process(processMessage)
      }
    )
  }
  for (const migration of pendingMigrations) {
    await appQueue.add({
      appId,
      migrationId: migration,
      previousMigrationId: migrationKeys[migrationKeys.indexOf(migration) - 1],
    })
  }

  const isBlocking = pendingMigrations.some(m => MIGRATIONS[m].blocking)

  return next()
}
