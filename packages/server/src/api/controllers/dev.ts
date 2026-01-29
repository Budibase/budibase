import { env as envCore, events } from "@budibase/backend-core"
import {
  ClearDevLockResponse,
  Ctx,
  GetVersionResponse,
  RevertWorkspaceResponse,
} from "@budibase/types"
import fetch from "node-fetch"
import env from "../../environment"
import sdk from "../../sdk"
import { checkSlashesInUrl } from "../../utilities"
import { clearLock as redisClearLock } from "../../utilities/redis"
import { createRequest } from "../../utilities/workerRequests"

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

export async function revert(ctx: Ctx<void, RevertWorkspaceResponse>) {
  const { appId } = ctx.params

  const result = await sdk.dev.revertDevChanges({
    appId,
    userId: ctx.user?._id,
  })

  if (!result.success) {
    ctx.throw(
      500,
      "Revert it's taking too long, please refresh or try again later."
    )
  }
  ctx.body = {
    status: "applied",
  }
}

export async function getBudibaseVersion(ctx: Ctx<void, GetVersionResponse>) {
  const version = envCore.VERSION
  ctx.body = {
    version,
  }
  await events.installation.versionChecked(version)
}
