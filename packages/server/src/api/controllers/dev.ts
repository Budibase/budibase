import fetch from "node-fetch"
import env from "../../environment"
import { checkSlashesInUrl } from "../../utilities"
import { createRequest } from "../../utilities/workerRequests"
import { clearLock as redisClearLock } from "../../utilities/redis"
import { DocumentType } from "../../db/utils"
import {
  context,
  env as envCore,
  events,
  db as dbCore,
  cache,
} from "@budibase/backend-core"
import {
  App,
  ClearDevLockResponse,
  Ctx,
  GetVersionResponse,
  RevertAppResponse,
} from "@budibase/types"

async function redirect(
  ctx: any,
  method: "GET" | "POST" | "DELETE",
  path = "global"
) {
  const { devPath } = ctx.params
  const queryString = ctx.originalUrl.split("?")[1] || ""
  const response = await fetch(
    checkSlashesInUrl(
      `${env.WORKER_URL}/api/${path}/${devPath}?${queryString}`
    ),
    createRequest({
      ctx,
      method,
      body: ctx.request.body,
    })
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

export function buildRedirectGet(path: string) {
  return async (ctx: any) => {
    await redirect(ctx, "GET", path)
  }
}

export function buildRedirectPost(path: string) {
  return async (ctx: any) => {
    await redirect(ctx, "POST", path)
  }
}

export function buildRedirectDelete(path: string) {
  return async (ctx: any) => {
    await redirect(ctx, "DELETE", path)
  }
}

export async function clearLock(ctx: Ctx<void, ClearDevLockResponse>) {
  const { appId } = ctx.params
  try {
    await redisClearLock(appId, ctx.user)
  } catch (err) {
    ctx.throw(400, `Unable to remove lock. ${err}`)
  }
  ctx.body = {
    message: "Lock released successfully.",
  }
}

export async function revert(ctx: Ctx<void, RevertAppResponse>) {
  const { appId } = ctx.params
  const productionAppId = dbCore.getProdAppID(appId)

  // App must have been deployed first
  try {
    const db = context.getProdAppDB({ skip_setup: true })
    const exists = await db.exists()
    if (!exists) {
      throw new Error("App must be deployed to be reverted.")
    }
    const deploymentDoc = await db.get<any>(DocumentType.DEPLOYMENTS)
    if (
      !deploymentDoc.history ||
      Object.keys(deploymentDoc.history).length === 0
    ) {
      throw new Error("No deployments for app")
    }
  } catch (err) {
    return ctx.throw(400, "App has not yet been deployed")
  }

  const replication = new dbCore.Replication({
    source: productionAppId,
    target: appId,
  })
  try {
    if (env.COUCH_DB_URL) {
      // in-memory db stalls on rollback
      await replication.rollback()
    }

    // update appID in reverted app to be dev version again
    const db = context.getAppDB()
    const appDoc = await db.get<App>(DocumentType.APP_METADATA)
    appDoc.appId = appId
    appDoc.instance._id = appId
    await db.put(appDoc)
    await cache.app.invalidateAppMetadata(appId)
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

export async function getBudibaseVersion(ctx: Ctx<void, GetVersionResponse>) {
  const version = envCore.VERSION
  ctx.body = {
    version,
  }
  await events.installation.versionChecked(version)
}
