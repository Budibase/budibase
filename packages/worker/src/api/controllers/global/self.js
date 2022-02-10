const { getGlobalDB } = require("@budibase/backend-core/tenancy")
const { generateDevInfoID } = require("@budibase/backend-core/db")
const { newid } = require("@budibase/backend-core/utils")

function cleanupDevInfo(info) {
  // user doesn't need to aware of dev doc info
  delete info._id
  delete info._rev
  return info
}

exports.generateAPIKey = async ctx => {
  const db = getGlobalDB()
  const id = generateDevInfoID(ctx.user._id)
  let devInfo
  try {
    devInfo = await db.get(id)
  } catch (err) {
    devInfo = { _id: id }
  }
  devInfo.apiKey = newid()
  await db.put(devInfo)
  ctx.body = cleanupDevInfo(devInfo)
}

exports.fetchAPIKey = async ctx => {
  const db = getGlobalDB()
  const id = generateDevInfoID(ctx.user._id)
  let devInfo
  try {
    devInfo = await db.get(id)
  } catch (err) {
    devInfo = {
      _id: id,
      apiKey: newid(),
    }
    await db.put(devInfo)
  }
  ctx.body = cleanupDevInfo(devInfo)
}
