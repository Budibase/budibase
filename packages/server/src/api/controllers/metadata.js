const { MetadataTypes } = require("../../constants")
const CouchDB = require("../../db")
const { generateMetadataID } = require("../../db/utils")
const { saveEntityMetadata, deleteEntityMetadata } = require("../../utilities")

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
  ctx.body = await saveEntityMetadata(
    ctx.appId,
    type,
    entityId,
    ctx.request.body
  )
}

exports.deleteMetadata = async ctx => {
  const { type, entityId } = ctx.params
  await deleteEntityMetadata(ctx.appId, type, entityId)
  ctx.body = {
    message: "Metadata deleted successfully",
  }
}

exports.getMetadata = async ctx => {
  const { type, entityId } = ctx.params
  const db = new CouchDB(ctx.appId)
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
