import { context } from "@budibase/backend-core"
import { migrate as migrationImpl } from "../../migrations"
import { Ctx } from "@budibase/types"
import { MIGRATIONS, MigrationDoc } from "../../middleware/migrations"

export async function migrate(ctx: Ctx) {
  const options = ctx.request.body
  // don't await as can take a while, just return
  migrationImpl(options)
  ctx.status = 200
}

export async function fetchDefinitions(ctx: Ctx) {
  ctx.body = MIGRATIONS
  ctx.status = 200
}

export async function migrationCompleted(ctx: Ctx) {
  const db = context.getAppDB()
  const migrationDoc = await db.get<MigrationDoc>("_design/migrations")
  const latestMigration =
    Object.keys(MIGRATIONS).sort()[Object.keys(MIGRATIONS).length - 1]

  const migrated = migrationDoc.version === latestMigration

  ctx.body = { migrated }
  ctx.status = 200
}
