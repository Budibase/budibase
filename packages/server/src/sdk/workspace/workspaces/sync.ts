import { context, db as dbCore, logging, roles } from "@budibase/backend-core"
import { sdk as proSdk } from "@budibase/pro"
import { utils } from "@budibase/shared-core"
import { ContextUser, User, UserGroup } from "@budibase/types"
import sdk from "../.."
import { generateUserMetadataID, InternalTables } from "../../../db/utils"
import env from "../../../environment"
import { getRawGlobalUsers, processUser } from "../../../utilities/global"

type DeletedUser = { _id: string; deleted: boolean }

function userSyncEnabled() {
  return !env.DISABLE_USER_SYNC
}

async function syncUsersToWorkspace(
  workspaceId: string,
  users: (User | DeletedUser)[],
  groups: UserGroup[]
) {
  if (!(await dbCore.dbExists(workspaceId))) {
    return
  }
  await context.doInWorkspaceContext(workspaceId, async () => {
    const db = context.getWorkspaceDB()
    for (const user of users) {
      let ctxUser = user as ContextUser
      let deletedUser = false
      const metadataId = generateUserMetadataID(user._id!)
      if ((user as DeletedUser).deleted) {
        deletedUser = true
      }

      // make sure role is correct
      if (!deletedUser) {
        ctxUser = await processUser(ctxUser, { appId: workspaceId, groups })
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
        // no role - user isn't in workspace anyway
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
      if (userSyncEnabled() && (deletedUser || !roleId)) {
        await db.remove(metadata)
        continue
      }

      // assign the roleId for the ctxUser doc
      if (roleId) {
        ctxUser.roleId = roleId
      }

      let combined = sdk.users.combineMetadataAndUser(ctxUser, metadata)
      // if no combined returned, there are no updates to make
      if (combined) {
        await db.put(combined)
      }
    }
  })
}

async function buildSyncUsers(userIds: string[]) {
  // list of users, if one has been deleted it will be undefined in array
  const users = await getRawGlobalUsers(userIds)
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
  return { finalUsers, groups }
}

export async function syncUsersAgainstWorkspaces(
  userIds: string[],
  workspaceIdsToCheck: string[]
) {
  if (!workspaceIdsToCheck.length) {
    return
  }

  const workspaceIds = new Set<string>()
  for (const id of workspaceIdsToCheck) {
    if (!id) {
      continue
    }
    const devId = dbCore.getDevWorkspaceID(id)
    const prodId = dbCore.getProdWorkspaceID(id)
    if (devId) {
      workspaceIds.add(devId)
    }
    if (prodId) {
      workspaceIds.add(prodId)
    }
  }

  if (!workspaceIds.size) {
    return
  }

  const { finalUsers, groups } = await buildSyncUsers(userIds)
  let promises: Promise<void>[] = []
  await utils.parallelForeach(
    [...workspaceIds],
    async id => {
      if (!id) {
        return
      }
      try {
        const syncAction = syncUsersToWorkspace(id, finalUsers, groups)
        promises.push(syncAction)
        await syncAction
      } catch {
        // Don't throw, promises checks will be check under
      }
    },
    10
  )
  const resp = await Promise.allSettled(promises)
  const failed = resp.filter(promise => promise.status === "rejected")
  const reasons = failed
    .map(fail => (fail as PromiseRejectedResult).reason)
    .filter(reason => !dbCore.isDocumentConflictError(reason))
  if (reasons.length > 0) {
    logging.logWarn("Failed to sync users to workspaces", reasons)
  }
}

export async function syncUsersAcrossWorkspaces(userIds: string[]) {
  const devWorkspaceIds = await dbCore.getDevWorkspaceIDs()
  await syncUsersAgainstWorkspaces(userIds, devWorkspaceIds)
}

export async function syncWorkspace(
  workspaceId: string,
  opts?: { automationOnly?: boolean }
): Promise<{ message: string }> {
  if (env.DISABLE_AUTO_PROD_APP_SYNC) {
    return {
      message:
        "App sync disabled. You can reenable with the DISABLE_AUTO_PROD_APP_SYNC environment variable.",
    }
  }

  if (dbCore.isProdWorkspaceID(workspaceId)) {
    throw new Error("This action cannot be performed for production apps")
  }

  // replicate prod to dev
  const prodWorkspaceId = dbCore.getProdWorkspaceID(workspaceId)

  // specific case, want to make sure setup is skipped
  const prodDb = context.getProdWorkspaceDB({ skip_setup: true })
  const exists = await prodDb.exists()

  let error
  if (exists) {
    const replication = new dbCore.Replication({
      source: prodWorkspaceId,
      target: workspaceId,
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
  if (userSyncEnabled()) {
    await sdk.users.syncGlobalUsers()
  }

  if (error) {
    throw error
  } else {
    return {
      message: "App sync completed successfully.",
    }
  }
}
