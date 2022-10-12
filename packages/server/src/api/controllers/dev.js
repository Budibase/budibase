const fetch = require("node-fetch")
const env = require("../../environment")
const { checkSlashesInUrl } = require("../../utilities")
const { request } = require("../../utilities/workerRequests")
const { clearLock } = require("../../utilities/redis")
const { Replication, getProdAppID } = require("@budibase/backend-core/db")
const { DocumentType } = require("../../db/utils")
const { app: appCache } = require("@budibase/backend-core/cache")
const { getProdAppDB, getAppDB } = require("@budibase/backend-core/context")
const { events } = require("@budibase/backend-core")

async function redirect(ctx, method, path = "global") {
  const { devPath } = ctx.params
  const queryString = ctx.originalUrl.split("?")[1] || ""
  const response = await fetch(
    checkSlashesInUrl(
      `${env.WORKER_URL}/api/${path}/${devPath}?${queryString}`
    ),
    request(
      ctx,
      {
        method,
        body: ctx.request.body,
      },
      true
    )
  )
  if (response.status !== 200) {
    const err = await response.text()
    ctx.throw(400, err)
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

exports.buildRedirectGet = path => {
  return async ctx => {
    await redirect(ctx, "GET", path)
  }
}

exports.buildRedirectPost = path => {
  return async ctx => {
    await redirect(ctx, "POST", path)
  }
}

exports.buildRedirectDelete = path => {
  return async ctx => {
    await redirect(ctx, "DELETE", path)
  }
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
  const productionAppId = getProdAppID(appId)

  // App must have been deployed first
  try {
    const db = getProdAppDB({ skip_setup: true })
    const info = await db.info()
    if (info.error) {
      throw info.error
    }
    const deploymentDoc = await db.get(DocumentType.DEPLOYMENTS)
    if (
      !deploymentDoc.history ||
      Object.keys(deploymentDoc.history).length === 0
    ) {
      throw new Error("No deployments for app")
    }
  } catch (err) {
    return ctx.throw(400, "App has not yet been deployed")
  }

  const replication = new Replication({
    source: productionAppId,
    target: appId,
  })
  try {
    if (env.COUCH_DB_URL) {
      // in-memory db stalls on rollback
      await replication.rollback()
    }

    // update appID in reverted app to be dev version again
    const db = getAppDB()
    const appDoc = await db.get(DocumentType.APP_METADATA)
    appDoc.appId = appId
    appDoc.instance._id = appId
    await db.put(appDoc)
    await appCache.invalidateAppMetadata(appId)
    ctx.body = {
      message: "Reverted changes successfully.",
    }
    await events.app.reverted(appDoc)
  } catch (err) {
    ctx.throw(400, `Unable to revert. ${err}`)
  } finally {
    await replication.close()
  }
}

exports.getBudibaseVersion = async ctx => {
  const version = require("../../../package.json").version
  ctx.body = {
    version,
  }
  await events.installation.versionChecked(version)
}
