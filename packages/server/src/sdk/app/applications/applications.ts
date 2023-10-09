import { AppStatus } from "../../../db/utils"
import { App, ContextUser, User } from "@budibase/types"
import { getLocksById } from "../../../utilities/redis"
import { enrichApps } from "../../users/sessions"
import { checkAppMetadata } from "../../../automations/logging"
import { db as dbCore, users } from "@budibase/backend-core"
import { groups } from "@budibase/pro"

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

  const enrichedUser = await groups.enrichUserRolesFromGroups({
    ...user,
    roles: user.roles || {},
  })
  apps = filterAppList(enrichedUser, apps)

  const appIds = apps
    .filter((app: any) => app.status === "development")
    .map((app: any) => app.appId)

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
