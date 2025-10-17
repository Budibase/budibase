import { context } from "@budibase/backend-core"
import { Ctx, GetMigrationStatus } from "@budibase/types"
import { isWorkspaceFullyMigrated } from "../../workspaceMigrations"

export async function getMigrationStatus(ctx: Ctx<void, GetMigrationStatus>) {
  const appId = context.getWorkspaceId()
  if (!appId) {
    ctx.throw("AppId could not be found")
  }
  const migrated = await isWorkspaceFullyMigrated(appId)
  ctx.body = { migrated }
}
