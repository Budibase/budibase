import { MetadataTypes } from "../../constants"
import { generateMetadataID } from "../../db/utils"
import { saveEntityMetadata, deleteEntityMetadata } from "../../utilities"
import { context } from "@budibase/backend-core"
import { BBContext } from "@budibase/types"

export async function getTypes(ctx: BBContext) {
  ctx.body = {
    types: MetadataTypes,
  }
}

export async function saveMetadata(ctx: BBContext) {
  const { type, entityId } = ctx.params
  if (type === MetadataTypes.AUTOMATION_TEST_HISTORY) {
    ctx.throw(400, "Cannot save automation history type")
  }
  ctx.body = await saveEntityMetadata(type, entityId, ctx.request.body)
}

export async function deleteMetadata(ctx: BBContext) {
  const { type, entityId } = ctx.params
  await deleteEntityMetadata(type, entityId)
  ctx.body = {
    message: "Metadata deleted successfully",
  }
}

export async function getMetadata(ctx: BBContext) {
  const { type, entityId } = ctx.params
  const db = context.getAppDB()
  const id = generateMetadataID(type, entityId)
  try {
    ctx.body = await db.get(id)
  } catch (err: any) {
    if (err.status === 404) {
      ctx.body = {}
    } else {
      ctx.throw(err.status, err)
    }
  }
}
