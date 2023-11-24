import { context, locks, queue } from "@budibase/backend-core"
import { UserCtx, Document, LockName, LockType } from "@budibase/types"
import Bull, { Job } from "bull"

export const MIGRATIONS: Record<string, { migration: () => Promise<void> }> = {
  "20231122115100": {
    migration: async () => {
      await new Promise<void>(r => {
        setTimeout(() => {
          console.error("a")
          r()
        }, 10000)
      })
    },
  },
  "20231122115532": {
    migration: async () => {
      await new Promise<void>(r => {
        setTimeout(() => {
          console.error("b")
          r()
        }, 10000)
      })
    },
  },
}

export interface MigrationDoc extends Document {
  version: string
}

const appQueues: Record<string, Bull.Queue<any>> = {}

async function processMessage(job: Job) {
  const { appId } = job.data

  await locks.doWithLock(
    {
      name: LockName.APP_MIGRATION,
      type: LockType.DEFAULT,
      resource: appId,
      ttl: 30000,
    },
    async () => {
      await context.doInAppContext(appId, async () => {
        const db = context.getAppDB()
        const migrationDoc = await db.get<MigrationDoc>("_design/migrations")

        const currentVersion = migrationDoc.version || ""

        const pendingMigrations = Object.keys(MIGRATIONS).filter(
          m => m > currentVersion
        )

        let index = 0
        for (const migration of pendingMigrations) {
          const counter = `(${++index}/${pendingMigrations.length})`
          console.info(`Running migration ${migration}... ${counter}`, {
            migration,
            appId,
          })
          await MIGRATIONS[migration].migration()
          await db.put({ ...migrationDoc, version: migration })
          console.info(`Migration ran successfully ${migration} ${counter}`, {
            migration,
            appId,
          })
        }
      })
    }
  )
}

export default async (ctx: UserCtx, next: any) => {
  if (!ctx.appId) {
    return next()
  }

  try {
    if (new URL(ctx.headers.referer!).pathname === "/builder/updating") {
      return next()
    }
  } catch {}

  const { appId } = ctx

  const db = context.getAppDB()
  let migrationDoc: MigrationDoc = { version: "" }
  try {
    // TODO: cache
    migrationDoc = await db.get<MigrationDoc>("_design/migrations")
  } catch (e: any) {
    if (e.status !== 404) {
      throw e
    }

    await db.put({ _id: "_design/migrations" })
  }

  const currentMigration = migrationDoc.version || ""

  const pendingMigrations = Object.keys(MIGRATIONS).some(
    m => m > currentMigration
  )

  if (pendingMigrations) {
    let appQueue = appQueues[appId]
    if (!appQueue) {
      await locks.doWithLock(
        {
          name: LockName.APP_MIGRATION,
          type: LockType.DEFAULT,
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

      if (!appQueue) {
        // TODO
        throw "Error"
      }
    }

    await appQueue.add(
      {
        appId,
      }
      // TODO: idempotency
    )

    ctx.response.set("migration-header", appId)
  }

  return next()
}
