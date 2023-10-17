import { db as dbCore, context } from "@budibase/backend-core"
import { search as stringSearch, addRev } from "./utils"
import * as controller from "../application"
import * as deployController from "../deploy"
import * as backupController from "../backup"
import { Application } from "../../../definitions/common"
import { UserCtx } from "@budibase/types"
import { Next } from "koa"
import { sdk as proSdk } from "@budibase/pro"

function fixAppID(app: Application, params: any) {
  if (!params) {
    return app
  }
  if (!app._id && params.appId) {
    app._id = params.appId
  }
  return app
}

async function setResponseApp(ctx: UserCtx) {
  const appId = ctx.body?.appId
  if (appId && (!ctx.params || !ctx.params.appId)) {
    ctx.params = { appId }
  }
  if (appId) {
    await context.doInContext(appId, () => {
      return controller.fetchAppPackage(ctx)
    })
  } else {
    return controller.fetchAppPackage(ctx)
  }
}

export async function search(ctx: UserCtx, next: Next) {
  const { name } = ctx.request.body
  const apps = await dbCore.getAllApps({ all: true })
  ctx.body = stringSearch(apps, name)
  await next()
}

export async function create(ctx: UserCtx, next: Next) {
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

export async function read(ctx: UserCtx, next: Next) {
  await context.doInAppContext(ctx.params.appId, async () => {
    await setResponseApp(ctx)
    await next()
  })
}

export async function update(ctx: UserCtx, next: Next) {
  ctx.request.body = await addRev(fixAppID(ctx.request.body, ctx.params))
  await context.doInAppContext(ctx.params.appId, async () => {
    await controller.update(ctx)
    await setResponseApp(ctx)
    await next()
  })
}

export async function destroy(ctx: UserCtx, next: Next) {
  await context.doInAppContext(ctx.params.appId, async () => {
    // get the app before deleting it
    await setResponseApp(ctx)
    const body = ctx.body
    await controller.destroy(ctx)
    // overwrite the body again
    ctx.body = body
    await next()
  })
}

export async function unpublish(ctx: UserCtx, next: Next) {
  await context.doInAppContext(ctx.params.appId, async () => {
    await controller.unpublish(ctx)
    ctx.body = undefined
    ctx.status = 204
    await next()
  })
}

export async function publish(ctx: UserCtx, next: Next) {
  await context.doInAppContext(ctx.params.appId, async () => {
    await deployController.publishApp(ctx)
    await next()
  })
}

// get licensed endpoints from pro
export const importToApp = proSdk.publicApi.applications.buildImportFn(
  controller.importToApp
)
export const exportApp = proSdk.publicApi.applications.buildExportFn(
  backupController.exportAppDump
)

export default {
  create,
  update,
  read,
  destroy,
  search,
  unpublish,
  publish,
  importToApp,
  exportApp,
}
