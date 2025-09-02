import { AppStatus } from "../../../db/utils"
import { Workspace, ContextUser, User } from "@budibase/types"
import { getLocksById } from "../../../utilities/redis"
import { enrichWorkspaces } from "../../users/sessions"
import { checkAppMetadata } from "../../../automations/logging"
import { db, db as dbCore, users } from "@budibase/backend-core"
import { groups } from "@budibase/pro"
import sdk from "../.."

function filterWorkspaceList(user: User, workspaces: Workspace[]) {
  let workspaceList: string[] = []
  const roleApps = Object.keys(user.roles)
  if (users.hasAppBuilderPermissions(user)) {
    workspaceList = user.builder?.apps || []
    workspaceList = workspaceList.concat(roleApps)
  } else if (!users.isAdminOrBuilder(user)) {
    workspaceList = roleApps
  } else {
    return workspaces
  }
  return workspaces.filter(w =>
    workspaceList.includes(dbCore.getProdWorkspaceID(w.appId))
  )
}

export async function fetch(status: AppStatus, user: ContextUser) {
  const dev = status === AppStatus.DEV
  const all = status === AppStatus.ALL
  let workspaces = (await dbCore.getAllApps({ dev, all })) as Workspace[]

  // need to type this correctly - add roles back in to convert from ContextUser to User
  const completeUser: User = {
    ...user,
    roles: user?.roles || {},
  }
  const enrichedUser = await groups.enrichUserRolesFromGroups(completeUser)
  workspaces = filterWorkspaceList(enrichedUser, workspaces)

  const workspaceIds = workspaces
    .filter(w => w.status === "development")
    .map(w => w.appId)

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

  // Enrich workspaces with all builder user sessions
  const enrichedWorkspaces = await enrichWorkspaces(workspaces)

  return await checkAppMetadata(enrichedWorkspaces)
}

export async function enrichWithDefaultWorkspaceWorkspaceUrl(
  workspaces: Workspace[]
) {
  const result = []
  for (const workspace of workspaces) {
    const workspaceApps = await db.doWithDB(workspace.appId, db =>
      sdk.workspaceApps.fetch(db)
    )

    result.push({
      ...workspace,
      defaultWorkspaceAppUrl: workspaceApps[0]?.url || "",
    })
  }

  return result
}
