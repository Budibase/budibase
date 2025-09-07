import { db, db as dbCore, users } from "@budibase/backend-core"
import { groups } from "@budibase/pro"
import { ContextUser, User, Workspace } from "@budibase/types"
import sdk from "../.."
import { checkAppMetadata } from "../../../automations/logging"
import { WorkspaceStatus } from "../../../db/utils"
import { getLocksById } from "../../../utilities/redis"
import { enrichApps } from "../../users/sessions"

export function filterAppList(user: User, apps: Workspace[]) {
  let appList: string[] = []
  const roleApps = Object.keys(user.roles)
  if (users.hasAppBuilderPermissions(user)) {
    appList = user.builder?.apps || []
    appList = appList.concat(roleApps)
  } else if (!users.isAdminOrBuilder(user)) {
    appList = roleApps
  } else {
    return apps
  }
  return apps.filter(app =>
    appList.includes(dbCore.getProdWorkspaceID(app.appId))
  )
}

export async function fetch(status: WorkspaceStatus, user: ContextUser) {
  const dev = status === WorkspaceStatus.DEV
  const all = status === WorkspaceStatus.ALL
  let workspaces = await dbCore.getAllWorkspaces({ dev, all })

  // need to type this correctly - add roles back in to convert from ContextUser to User
  const completeUser: User = {
    ...user,
    roles: user?.roles || {},
  }
  const enrichedUser = await groups.enrichUserRolesFromGroups(completeUser)
  workspaces = filterAppList(enrichedUser, workspaces)

  const workspaceIds = workspaces
    .filter(workspace => workspace.status === "development")
    .map(workspace => workspace.appId)

  // get the locks for all the dev workspaces
  if (dev || all) {
    const locks = await getLocksById(workspaceIds)
    for (let workspace of workspaces) {
      const lock = locks[workspace.appId]
      if (lock) {
        workspace.lockedBy = lock as any
      } else {
        // make sure its definitely not present
        delete workspace.lockedBy
      }
    }
  }

  // Enrich apps with all builder user sessions
  const enrichedWorkspaces = await enrichApps(workspaces)

  return await checkAppMetadata(enrichedWorkspaces)
}

export async function enrichWithDefaultWorkspaceAppUrl(apps: Workspace[]) {
  const result = []
  for (const app of apps) {
    const workspaceApps = await db.doWithDB(app.appId, db =>
      sdk.workspaceApps.fetch(db)
    )

    result.push({
      ...app,
      defaultWorkspaceAppUrl: workspaceApps[0]?.url || "",
    })
  }

  return result
}
