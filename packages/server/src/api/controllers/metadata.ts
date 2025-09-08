import { context } from "@budibase/backend-core"
import {
  DeleteMetadataResponse,
  FindMetadataResponse,
  GetMetadataTypesResponse,
  MetadataType,
  SaveMetadataRequest,
  SaveMetadataResponse,
  UserCtx,
} from "@budibase/types"
import { generateMetadataID } from "../../db/utils"
import { deleteEntityMetadata, saveEntityMetadata } from "../../utilities"

export async function getTypes(ctx: UserCtx<void, GetMetadataTypesResponse>) {
  ctx.body = {
    types: MetadataType,
  }
}

export async function saveMetadata(
  ctx: UserCtx<SaveMetadataRequest, SaveMetadataResponse>
) {
  const { type, entityId } = ctx.params
  if (type === MetadataType.AUTOMATION_TEST_HISTORY) {
    ctx.throw(400, "Cannot save automation history type")
  }
  ctx.body = await saveEntityMetadata(type, entityId, ctx.request.body)
}

export async function deleteMetadata(
  ctx: UserCtx<void, DeleteMetadataResponse>
) {
  const { type, entityId } = ctx.params
  await deleteEntityMetadata(type, entityId)
  ctx.body = {
    message: "Metadata deleted successfully",
  }
}

export async function getMetadata(ctx: UserCtx<void, FindMetadataResponse>) {
  const { type, entityId } = ctx.params
  const db = context.getWorkspaceDB()
  const id = generateMetadataID(type, entityId)
  ctx.body = (await db.tryGet(id)) || {}
}
