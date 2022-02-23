const { search } = require("./utils")
const { getAllApps } = require("@budibase/backend-core/db")
const { updateAppId } = require("@budibase/backend-core/context")
const controller = require("../application")

async function setResponseApp(ctx) {
  if (ctx.body && ctx.body.appId && (!ctx.params || !ctx.params.appId)) {
    ctx.params = { appId: ctx.body.appId }
  }
  await controller.fetchAppPackage(ctx)
}

exports.search = async ctx => {
  const { name } = ctx.request.body
  const apps = await getAllApps({ all: true })
  ctx.body = {
    applications: search(apps, name),
  }
}

exports.create = async ctx => {
  await controller.create(ctx)
  await setResponseApp(ctx)
}

exports.read = async ctx => {
  updateAppId(ctx.params.appId)
  await setResponseApp(ctx)
}

exports.update = async ctx => {
  updateAppId(ctx.params.appId)
  await controller.update(ctx)
  await setResponseApp(ctx)
}

exports.delete = async ctx => {
  updateAppId(ctx.params.appId)
  // get the app before deleting it
  await setResponseApp(ctx)
  const body = ctx.body
  await controller.delete(ctx)
  // overwrite the body again
  ctx.body = body
}
