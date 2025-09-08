import { context } from "@budibase/backend-core"
import {
  ContextUserMetadata,
  Ctx,
  DeleteUserMetadataResponse,
  FetchUserMetadataResponse,
  FindUserMetadataResponse,
  Flags,
  GetUserFlagsResponse,
  SetUserFlagRequest,
  SetUserFlagResponse,
  UpdateSelfMetadataRequest,
  UpdateSelfMetadataResponse,
  UpdateUserMetadataRequest,
  UpdateUserMetadataResponse,
  UserCtx,
} from "@budibase/types"
import { generateUserFlagID, InternalTables } from "../../db/utils"
import sdk from "../../sdk"
import { getFullUser } from "../../utilities/users"

export async function fetchMetadata(ctx: Ctx<void, FetchUserMetadataResponse>) {
  ctx.body = await sdk.users.fetchMetadata()
}

export async function updateSelfMetadata(
  ctx: UserCtx<UpdateSelfMetadataRequest, UpdateSelfMetadataResponse>
) {
  // overwrite the ID with current users
  ctx.request.body._id = ctx.user?._id
  // make sure no stale rev
  delete ctx.request.body._rev
  // make sure no csrf token
  delete ctx.request.body.csrfToken
  await updateMetadata(ctx)
}

export async function updateMetadata(
  ctx: UserCtx<UpdateUserMetadataRequest, UpdateUserMetadataResponse>
) {
  const db = context.getWorkspaceDB()
  const user = ctx.request.body
  const metadata: ContextUserMetadata = {
    tableId: InternalTables.USER_METADATA,
    ...user,
  }
  // this isn't applicable to the user
  delete metadata.roles
  ctx.body = await db.put(metadata)
}

export async function destroyMetadata(
  ctx: UserCtx<void, DeleteUserMetadataResponse>
) {
  const db = context.getWorkspaceDB()
  try {
    const dbUser = await sdk.users.get(ctx.params.id)
    await db.remove(dbUser._id!, dbUser._rev)
  } catch (err) {
    // error just means the global user has no config in this app
  }
  ctx.body = {
    message: `User metadata ${ctx.params.id} deleted.`,
  }
}

export async function findMetadata(
  ctx: UserCtx<void, FindUserMetadataResponse>
) {
  ctx.body = await getFullUser(ctx.params.id)
}

export async function setFlag(
  ctx: UserCtx<SetUserFlagRequest, SetUserFlagResponse>
) {
  const userId = ctx.user?._id
  const { flag, value } = ctx.request.body
  if (!flag) {
    ctx.throw(400, "Must supply a 'flag' field in request body.")
  }
  const flagDocId = generateUserFlagID(userId!)
  const db = context.getWorkspaceDB()
  let doc: Flags
  try {
    doc = await db.get<Flags>(flagDocId)
  } catch (err) {
    doc = { _id: flagDocId }
  }
  doc[flag] = value || true
  await db.put(doc)
  ctx.body = { message: "Flag set successfully" }
}

export async function getFlags(ctx: UserCtx<void, GetUserFlagsResponse>) {
  const userId = ctx.user?._id
  const docId = generateUserFlagID(userId!)
  const db = context.getWorkspaceDB()
  let doc: Flags
  try {
    doc = await db.get<Flags>(docId)
  } catch (err) {
    doc = { _id: docId }
  }
  ctx.body = doc
}
