const { getAllApps } = require("@budibase/backend-core/db")
const { updateAppId } = require("@budibase/backend-core/context")
import { search as stringSearch, wrapResponse } from "./utils"
import { default as controller } from "../application"
import { Application } from "../../../definitions/common"

function fixAppID(app: Application, params: any) {
  if (!params) {
    return app
  }
  if (!app._id && params.appId) {
    app._id = params.appId
  }
  return app
}

async function setResponseApp(ctx: any) {
  if (ctx.body && ctx.body.appId && (!ctx.params || !ctx.params.appId)) {
    ctx.params = { appId: ctx.body.appId }
  }
  await controller.fetchAppPackage(ctx)
  // for now remove everything else
  wrapResponse(ctx, (input: any) => input.application)
}

export async function search(ctx: any) {
  const { name } = ctx.request.body
  const apps = await getAllApps({ all: true })
  ctx.body = stringSearch(apps, name)
  wrapResponse(ctx)
}

export async function create(ctx: any) {
  if (!ctx.request.body || !ctx.request.body.useTemplate) {
    ctx.request.body = {
      useTemplate: false,
      ...ctx.request.body,
    }
  }
  await controller.create(ctx)
  await setResponseApp(ctx)
}

export async function read(ctx: any) {
  updateAppId(ctx.params.appId)
  await setResponseApp(ctx)
}

export async function update(ctx: any) {
  ctx.request.body = fixAppID(ctx.request.body, ctx.params)
  updateAppId(ctx.params.appId)
  await controller.update(ctx)
  await setResponseApp(ctx)
}

export async function destroy(ctx: any) {
  updateAppId(ctx.params.appId)
  // get the app before deleting it
  await setResponseApp(ctx)
  const body = ctx.body
  await controller.delete(ctx)
  // overwrite the body again
  ctx.body = body
}

export default {
  create,
  update,
  read,
  destroy,
  search,
}
