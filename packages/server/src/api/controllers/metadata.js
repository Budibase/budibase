const { MetadataTypes } = require("../../constants")
const { generateMetadataID } = require("../../db/utils")
const { saveEntityMetadata, deleteEntityMetadata } = require("../../utilities")
const { getAppDB } = require("@budibase/backend-core/context")

exports.getTypes = async ctx => {
  ctx.body = {
    types: MetadataTypes,
  }
}

exports.saveMetadata = async ctx => {
  const { type, entityId } = ctx.params
  if (type === MetadataTypes.AUTOMATION_TEST_HISTORY) {
    ctx.throw(400, "Cannot save automation history type")
  }
  ctx.body = await saveEntityMetadata(type, entityId, ctx.request.body)
}

exports.deleteMetadata = async ctx => {
  const { type, entityId } = ctx.params
  await deleteEntityMetadata(type, entityId)
  ctx.body = {
    message: "Metadata deleted successfully",
  }
}

exports.getMetadata = async ctx => {
  const { type, entityId } = ctx.params
  const db = getAppDB()
  const id = generateMetadataID(type, entityId)
  try {
    ctx.body = await db.get(id)
  } catch (err) {
    if (err.status === 404) {
      ctx.body = {}
    } else {
      ctx.throw(err.status, err)
    }
  }
}
