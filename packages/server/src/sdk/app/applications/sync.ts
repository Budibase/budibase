import env from "../../../environment"
import { db as dbCore, context, logging, roles } from "@budibase/backend-core"
import { User, ContextUser, UserGroup } from "@budibase/types"
import { sdk as proSdk } from "@budibase/pro"
import sdk from "../../"
import { getGlobalUsers, processUser } from "../../../utilities/global"
import { generateUserMetadataID, InternalTables } from "../../../db/utils"

type DeletedUser = { _id: string; deleted: boolean }

async function syncUsersToApp(
  appId: string,
  users: (User | DeletedUser)[],
  groups: UserGroup[]
) {
  if (!(await dbCore.dbExists(appId))) {
    return
  }
  await context.doInAppContext(appId, async () => {
    const db = context.getAppDB()
    for (let user of users) {
      let ctxUser = user as ContextUser
      let deletedUser = false
      const metadataId = generateUserMetadataID(user._id!)
      if ((user as DeletedUser).deleted) {
        deletedUser = true
      }

      // make sure role is correct
      if (!deletedUser) {
        ctxUser = await processUser(ctxUser, { appId, groups })
      }
      let roleId = ctxUser.roleId
      if (roleId === roles.BUILTIN_ROLE_IDS.PUBLIC) {
        roleId = undefined
      }

      let metadata
      try {
        metadata = await db.get<any>(metadataId)
      } catch (err: any) {
        if (err.status !== 404) {
          throw err
        }
        // no metadata and user is to be deleted, can skip
        // no role - user isn't in app anyway
        if (!roleId) {
          continue
        } else if (!deletedUser) {
          // doesn't exist yet, creating it
          metadata = {
            tableId: InternalTables.USER_METADATA,
          }
        }
      }

      // the user doesn't exist, or doesn't have a role anymore
      // get rid of their metadata
      if (deletedUser || !roleId) {
        await db.remove(metadata)
        continue
      }

      // assign the roleId for the metadata doc
      if (roleId) {
        metadata.roleId = roleId
      }

      let combined = sdk.users.combineMetadataAndUser(ctxUser, metadata)
      // if no combined returned, there are no updates to make
      if (combined) {
        await db.put(combined)
      }
    }
  })
}

export async function syncUsersToAllApps(userIds: string[]) {
  // list of users, if one has been deleted it will be undefined in array
  const users = (await getGlobalUsers(userIds, {
    noProcessing: true,
  })) as User[]
  const groups = await proSdk.groups.fetch()
  const finalUsers: (User | DeletedUser)[] = []
  for (let userId of userIds) {
    const user = users.find(user => user._id === userId)
    if (!user) {
      finalUsers.push({ _id: userId, deleted: true })
    } else {
      finalUsers.push(user)
    }
  }
  const devAppIds = await dbCore.getDevAppIDs()
  let promises = []
  for (let devAppId of devAppIds) {
    const prodAppId = dbCore.getProdAppID(devAppId)
    for (let appId of [prodAppId, devAppId]) {
      promises.push(syncUsersToApp(appId, finalUsers, groups))
    }
  }
  const resp = await Promise.allSettled(promises)
  const failed = resp.filter(promise => promise.status === "rejected")
  const reasons = failed
    .map(fail => (fail as PromiseRejectedResult).reason)
    .filter(reason => !dbCore.isDocumentConflictError(reason))
  if (reasons.length > 0) {
    logging.logWarn("Failed to sync users to apps", reasons)
  }
}

export async function syncApp(
  appId: string,
  opts?: { automationOnly?: boolean }
) {
  if (env.DISABLE_AUTO_PROD_APP_SYNC) {
    return {
      message:
        "App sync disabled. You can reenable with the DISABLE_AUTO_PROD_APP_SYNC environment variable.",
    }
  }

  if (dbCore.isProdAppID(appId)) {
    throw new Error("This action cannot be performed for production apps")
  }

  // replicate prod to dev
  const prodAppId = dbCore.getProdAppID(appId)

  // specific case, want to make sure setup is skipped
  const prodDb = context.getProdAppDB({ skip_setup: true })
  const exists = await prodDb.exists()

  let error
  if (exists) {
    const replication = new dbCore.Replication({
      source: prodAppId,
      target: appId,
    })
    try {
      const replOpts = replication.appReplicateOpts()
      if (opts?.automationOnly) {
        replOpts.filter = (doc: any) =>
          doc._id.startsWith(dbCore.DocumentType.AUTOMATION)
      }
      await replication.replicate(replOpts)
    } catch (err) {
      error = err
    } finally {
      await replication.close()
    }
  }

  // sync the users - kept for safe keeping
  await sdk.users.syncGlobalUsers()

  if (error) {
    throw error
  } else {
    return {
      message: "App sync completed successfully.",
    }
  }
}
