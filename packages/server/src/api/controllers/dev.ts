import fetch from "node-fetch"
import env from "../../environment"
import os from "os"
import process from "process"
import { checkSlashesInUrl } from "../../utilities"
import { request } from "../../utilities/workerRequests"
import { clearLock as redisClearLock } from "../../utilities/redis"
import { DocumentType } from "../../db/utils"
import { context, env as envCore } from "@budibase/backend-core"
import { events, db as dbCore, cache } from "@budibase/backend-core"


async function redirect(ctx: any, method: string, path: string = "global") {
  const { devPath } = ctx.params
  const queryString = ctx.originalUrl.split("?")[1] || ""
  const response = await fetch(
    checkSlashesInUrl(
      `${env.WORKER_URL}/api/${path}/${devPath}?${queryString}`
    ),
    request(ctx, {
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

export async function clearLock(ctx: any) {
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

export async function revert(ctx: any) {
  const { appId } = ctx.params
  const productionAppId = dbCore.getProdAppID(appId)

  // App must have been deployed first
  try {
    const db = context.getProdAppDB({ skip_setup: true })
    const exists = await db.exists()
    if (!exists) {
      throw new Error("App must be deployed to be reverted.")
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
    const appDoc = await db.get(DocumentType.APP_METADATA)
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

export async function getBudibaseVersion(ctx: any) {
  const version = envCore.VERSION
  ctx.body = {
    version,
  }
  await events.installation.versionChecked(version)
}

export async function systemDebugInfo(ctx: any) {
  const { days, hours, minutes } = secondsToHMS(os.uptime())
  const totalMemory = convertBytes(os.totalmem())

  ctx.body = {
    budibaseVersion: envCore.VERSION,
    hosting: envCore.DEPLOYMENT_ENVIRONMENT,
    nodeVersion: process.version,
    platform: process.platform,
    cpuArch: process.arch,
    cpuCores: os.cpus().length,
    cpuInfo: os.cpus()[0].model,
    totalMemory: `${totalMemory.gb}GB`,
    uptime: `${days} day(s), ${hours} hour(s), ${minutes} minute(s)`, 
  }
}

function secondsToHMS(seconds: number) {
  const MINUTE_IN_SECONDS = 60
  const HOUR_IN_SECONDS = 3600
  const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24

  const minutes = Math.floor((seconds / MINUTE_IN_SECONDS) % 60);
  const hours = Math.floor((seconds / HOUR_IN_SECONDS) % 24);
  const days = Math.floor(seconds / DAY_IN_SECONDS) 

  return {
    days,
    hours,
    minutes,
    seconds
  }
}

function convertBytes(bytes: number) {
    const kb = bytes / 1024;
    const mb = kb / 1024;
    const gb = mb / 1024;

    return { gb, mb, kb }
}
