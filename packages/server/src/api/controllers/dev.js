const fetch = require("node-fetch")
const CouchDB = require("../../db")
const env = require("../../environment")
const { checkSlashesInUrl } = require("../../utilities")
const { request } = require("../../utilities/workerRequests")
const { clearLock } = require("../../utilities/redis")
const { Replication } = require("@budibase/auth").db
const { DocumentTypes } = require("../../db/utils")

async function redirect(ctx, method) {
  const { devPath } = ctx.params
  const response = await fetch(
    checkSlashesInUrl(`${env.WORKER_URL}/api/admin/${devPath}`),
    request(ctx, {
      method,
      body: ctx.request.body,
    }, true)
  )
  if (response.status !== 200) {
    ctx.throw(response.status, response.statusText)
  }
  const cookie = response.headers.get("set-cookie")
  if (cookie) {
    ctx.set("set-cookie", cookie)
  }
  let body
  try {
    body = await response.json()
  } catch (err) {
    // don't worry about errors, likely no JSON
  }
  ctx.status = response.status
  if (body) {
    ctx.body = body
  }
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

exports.clearLock = async ctx => {
  const { appId } = ctx.params
  try {
    await clearLock(appId, ctx.user)
  } catch (err) {
    ctx.throw(400, `Unable to remove lock. ${err}`)
  }
  ctx.body = {
    message: "Lock released successfully.",
  }
}

exports.revert = async ctx => {
  const { appId } = ctx.params
  const productionAppId = appId.replace("_dev", "")

  // App must have been deployed first
  try {
    const db = new CouchDB(productionAppId, { skip_setup: true })
    const info = await db.info()
    if (info.error) throw info.error
  } catch (err) {
    return ctx.throw(400, "App has not yet been deployed")
  }

  try {
    const replication = new Replication({
      source: productionAppId,
      target: appId,
    })

    await replication.rollback()
    // update appID in reverted app to be dev version again
    const db = new CouchDB(appId)
    const appDoc = await db.get(DocumentTypes.APP_METADATA)
    appDoc.appId = appId
    appDoc.instance._id = appId
    await db.put(appDoc)
    ctx.body = {
      message: "Reverted changes successfully.",
    }
  } catch (err) {
    ctx.throw(400, `Unable to revert. ${err}`)
  }
}

exports.getBudibaseVersion = async ctx => {
  ctx.body = require("../../../package.json").version
}
