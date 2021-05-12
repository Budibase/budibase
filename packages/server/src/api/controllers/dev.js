const fetch = require("node-fetch")
const env = require("../../environment")
const { checkSlashesInUrl } = require("../../utilities")
const { request } = require("../../utilities/workerRequests")
const { getGlobalIDFromUserMetadataID } = require("../../db/utils")
const { clearLock } = require("../../utilities/redis")

async function redirect(ctx, method) {
  const { devPath } = ctx.params
  const response = await fetch(
    checkSlashesInUrl(`${env.WORKER_URL}/api/admin/${devPath}`),
    request(ctx, {
      method,
      body: ctx.request.body,
    })
  )
  ctx.body = await response.json()
  const cookie = response.headers.get("set-cookie")
  if (cookie) {
    ctx.set("set-cookie", cookie)
  }
  ctx.status = response.status
  ctx.cookies
}

exports.redirectGet = async ctx => {
  await redirect(ctx, "GET")
}

exports.redirectPost = async ctx => {
  await redirect(ctx, "POST")
}

exports.redirectDelete = async ctx => {
  await redirect(ctx, "DELETE")
}

exports.removeLock = async ctx => {
  const { appId } = ctx.params
  const globalUserId = getGlobalIDFromUserMetadataID(ctx.user._id)
  try {
    await clearLock(appId, globalUserId)
  } catch (err) {
    ctx.throw(400, "Unable to remove lock.")
  }
  ctx.body = {
    message: "Lock removed successfully."
  }
}
