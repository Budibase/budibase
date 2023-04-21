import { generateUserMetadataID, generateUserFlagID } from "../../db/utils"
import { InternalTables } from "../../db/utils"
import { getGlobalUsers } from "../../utilities/global"
import { getFullUser } from "../../utilities/users"
import { context } from "@budibase/backend-core"
import { UserCtx } from "@budibase/types"
import sdk from "../../sdk"

export async function fetchMetadata(ctx: UserCtx) {
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

export async function updateSelfMetadata(ctx: UserCtx) {
  // overwrite the ID with current users
  ctx.request.body._id = ctx.user?._id
  // make sure no stale rev
  delete ctx.request.body._rev
  // make sure no csrf token
  delete ctx.request.body.csrfToken
  await updateMetadata(ctx)
}

export async function updateMetadata(ctx: UserCtx) {
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

export async function destroyMetadata(ctx: UserCtx) {
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

export async function findMetadata(ctx: UserCtx) {
  ctx.body = await getFullUser(ctx, ctx.params.id)
}

export async function setFlag(ctx: UserCtx) {
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

export async function getFlags(ctx: UserCtx) {
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
