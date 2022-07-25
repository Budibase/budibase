const { getAllApps } = require("@budibase/backend-core/db")
const { doInAppContext } = require("@budibase/backend-core/context")
import { search as stringSearch, addRev } from "./utils"
import * as controller from "../application"
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
}

export async function search(ctx: any, next: any) {
  const { name } = ctx.request.body
  const apps = await getAllApps({ all: true })
  ctx.body = stringSearch(apps, name)
  await next()
}

export async function create(ctx: any, next: any) {
  if (!ctx.request.body || !ctx.request.body.useTemplate) {
    ctx.request.body = {
      useTemplate: false,
      ...ctx.request.body,
    }
  }
  await controller.create(ctx)
  await setResponseApp(ctx)
  await next()
}

export async function read(ctx: any, next: any) {
  await doInAppContext(ctx.params.appId, async () => {
    await setResponseApp(ctx)
    await next()
  })
}

export async function update(ctx: any, next: any) {
  ctx.request.body = await addRev(fixAppID(ctx.request.body, ctx.params))
  await doInAppContext(ctx.params.appId, async () => {
    await controller.update(ctx)
    await setResponseApp(ctx)
    await next()
  })
}

export async function destroy(ctx: any, next: any) {
  await doInAppContext(ctx.params.appId, async () => {
    // get the app before deleting it
    await setResponseApp(ctx)
    const body = ctx.body
    await controller.destroy(ctx)
    // overwrite the body again
    ctx.body = body
    await next()
  })
}

export default {
  create,
  update,
  read,
  destroy,
  search,
}
