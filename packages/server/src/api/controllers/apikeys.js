const builderDB = require("../../db/builder")

exports.fetch = async function(ctx) {
  try {
    const mainDoc = await builderDB.getBuilderMainDoc()
    ctx.body = mainDoc.apiKeys ? mainDoc.apiKeys : {}
  } catch (err) {
    /* istanbul ignore next */
    ctx.throw(400, err)
  }
}

exports.update = async function(ctx) {
  const key = ctx.params.key
  const value = ctx.request.body.value

  try {
    const mainDoc = await builderDB.getBuilderMainDoc()
    if (mainDoc.apiKeys == null) {
      mainDoc.apiKeys = {}
    }
    mainDoc.apiKeys[key] = value
    const resp = await builderDB.setBuilderMainDoc(mainDoc)
    ctx.body = {
      _id: resp.id,
      _rev: resp.rev,
    }
  } catch (err) {
    /* istanbul ignore next */
    ctx.throw(400, err)
  }
}
