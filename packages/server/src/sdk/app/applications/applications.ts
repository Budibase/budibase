import { AppStatus } from "../../../db/utils"
import { App, ContextUser, FeatureFlag, User } from "@budibase/types"
import { getLocksById } from "../../../utilities/redis"
import { enrichApps } from "../../users/sessions"
import { checkAppMetadata } from "../../../automations/logging"
import { db, db as dbCore, features, users } from "@budibase/backend-core"
import { groups } from "@budibase/pro"
import sdk from "../.."

export function filterAppList(user: User, apps: App[]) {
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
  return apps.filter(app => appList.includes(dbCore.getProdAppID(app.appId)))
}

export async function fetch(status: AppStatus, user: ContextUser) {
  const dev = status === AppStatus.DEV
  const all = status === AppStatus.ALL
  let apps = (await dbCore.getAllApps({ dev, all })) as App[]

  // need to type this correctly - add roles back in to convert from ContextUser to User
  const completeUser: User = {
    ...user,
    roles: user?.roles || {},
  }
  const enrichedUser = await groups.enrichUserRolesFromGroups(completeUser)
  apps = filterAppList(enrichedUser, apps)

  const appIds = apps
    .filter(app => app.status === "development")
    .map(app => app.appId)

  // get the locks for all the dev apps
  if (dev || all) {
    const locks = await getLocksById(appIds)
    for (let app of apps) {
      const lock = locks[app.appId]
      if (lock) {
        app.lockedBy = lock as any
      } else {
        // make sure its definitely not present
        delete app.lockedBy
      }
    }
  }

  // Enrich apps with all builder user sessions
  const enrichedApps = await enrichApps(apps)

  return await checkAppMetadata(enrichedApps)
}

export async function enrichWithDefaultWorkspaceAppUrl(apps: App[]) {
  const result = []
  if (await features.isEnabled(FeatureFlag.WORKSPACE_APPS)) {
    for (const app of apps) {
      const workspaceApps = await db.doWithDB(app.appId, db =>
        sdk.workspaceApps.fetch(db)
      )

      result.push({
        ...app,
        defaultWorkspaceAppUrl: workspaceApps[0]?.url || "",
      })
    }
  } else {
    result.push(...apps.map(a => ({ ...a, defaultWorkspaceAppUrl: "" })))
  }

  return result
}
