const { MetadataTypes } = require("../../constants")
const CouchDB = require("../../db")
const { generateMetadataID } = require("../../db/utils")
const { saveEntityMetadata } = require("../../utilities")

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
  const db = new CouchDB(ctx.appId)
  const id = generateMetadataID(type, entityId)
  let rev
  try {
    const metadata = await db.get(id)
    if (metadata) {
      rev = metadata._rev
    }
  } catch (err) {
    // don't need to error if it doesn't exist
  }
  if (id && rev) {
    await db.remove(id, rev)
  }
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
