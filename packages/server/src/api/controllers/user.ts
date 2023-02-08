import { generateUserMetadataID, generateUserFlagID } from "../../db/utils"
import { InternalTables } from "../../db/utils"
import { getGlobalUsers, getRawGlobalUser } from "../../utilities/global"
import { getFullUser } from "../../utilities/users"
import {
  context,
  roles as rolesCore,
  db as dbCore,
} from "@budibase/backend-core"
import { BBContext, Ctx, SyncUserRequest, User } from "@budibase/types"
import sdk from "../../sdk"

export async function syncUser(ctx: Ctx<SyncUserRequest>) {
  let deleting = false,
    user: User | any
  const userId = ctx.params.id

  const previousUser = ctx.request.body?.previousUser

  try {
    user = (await getRawGlobalUser(userId)) as User
  } catch (err: any) {
    if (err && err.status === 404) {
      user = {}
      deleting = true
    } else {
      throw err
    }
  }

  let previousApps = previousUser
    ? Object.keys(previousUser.roles).map(appId => appId)
    : []

  const roles = deleting ? {} : user.roles
  // remove props which aren't useful to metadata
  delete user.password
  delete user.forceResetPassword
  delete user.roles
  // run through all production appIDs in the users roles
  let prodAppIds
  // if they are a builder then get all production app IDs
  if ((user.builder && user.builder.global) || deleting) {
    prodAppIds = await dbCore.getProdAppIDs()
  } else {
    prodAppIds = Object.entries(roles)
      .filter(entry => entry[1] !== rolesCore.BUILTIN_ROLE_IDS.PUBLIC)
      .map(([appId]) => appId)
  }
  for (let prodAppId of new Set([...prodAppIds, ...previousApps])) {
    const roleId = roles[prodAppId]
    const deleteFromApp = !roleId
    const devAppId = dbCore.getDevelopmentAppID(prodAppId)
    for (let appId of [prodAppId, devAppId]) {
      if (!(await dbCore.dbExists(appId))) {
        continue
      }
      await context.doInAppContext(appId, async () => {
        const db = context.getAppDB()
        const metadataId = generateUserMetadataID(userId)
        let metadata
        try {
          metadata = await db.get(metadataId)
        } catch (err) {
          if (deleteFromApp) {
            return
          }
          metadata = {
            tableId: InternalTables.USER_METADATA,
          }
        }

        if (deleteFromApp) {
          await db.remove(metadata)
          return
        }

        // assign the roleId for the metadata doc
        if (roleId) {
          metadata.roleId = roleId
        }
        let combined = sdk.users.combineMetadataAndUser(user, metadata)
        // if its null then there was no updates required
        if (combined) {
          await db.put(combined)
        }
      })
    }
  }
  ctx.body = {
    message: "User synced.",
  }
}

export async function fetchMetadata(ctx: BBContext) {
  const global = await getGlobalUsers()
  const metadata = await sdk.users.rawUserMetadata()
  const users = []
  for (let user of global) {
    // find the metadata that matches up to the global ID
    const info = metadata.find(meta => meta._id.includes(user._id))
    // remove these props, not for the correct DB
    users.push({
      ...user,
      ...info,
      tableId: InternalTables.USER_METADATA,
      // make sure the ID is always a local ID, not a global one
      _id: generateUserMetadataID(user._id),
    })
  }
  ctx.body = users
}

export async function updateSelfMetadata(ctx: BBContext) {
  // overwrite the ID with current users
  ctx.request.body._id = ctx.user?._id
  // make sure no stale rev
  delete ctx.request.body._rev
  // make sure no csrf token
  delete ctx.request.body.csrfToken
  await updateMetadata(ctx)
}

export async function updateMetadata(ctx: BBContext) {
  const db = context.getAppDB()
  const user = ctx.request.body
  // this isn't applicable to the user
  delete user.roles
  const metadata = {
    tableId: InternalTables.USER_METADATA,
    ...user,
  }
  ctx.body = await db.put(metadata)
}

export async function destroyMetadata(ctx: BBContext) {
  const db = context.getAppDB()
  try {
    const dbUser = await db.get(ctx.params.id)
    await db.remove(dbUser._id, dbUser._rev)
  } catch (err) {
    // error just means the global user has no config in this app
  }
  ctx.body = {
    message: `User metadata ${ctx.params.id} deleted.`,
  }
}

export async function findMetadata(ctx: BBContext) {
  ctx.body = await getFullUser(ctx, ctx.params.id)
}

export async function setFlag(ctx: BBContext) {
  const userId = ctx.user?._id
  const { flag, value } = ctx.request.body
  if (!flag) {
    ctx.throw(400, "Must supply a 'flag' field in request body.")
  }
  const flagDocId = generateUserFlagID(userId!)
  const db = context.getAppDB()
  let doc
  try {
    doc = await db.get(flagDocId)
  } catch (err) {
    doc = { _id: flagDocId }
  }
  doc[flag] = value || true
  await db.put(doc)
  ctx.body = { message: "Flag set successfully" }
}

export async function getFlags(ctx: BBContext) {
  const userId = ctx.user?._id
  const docId = generateUserFlagID(userId!)
  const db = context.getAppDB()
  let doc
  try {
    doc = await db.get(docId)
  } catch (err) {
    doc = { _id: docId }
  }
  ctx.body = doc
}
