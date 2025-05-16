import {
  Ctx,
  InsertProjectAppRequest,
  InsertProjectAppResponse,
  WorkspaceApp,
  ProjectAppResponse,
  UpdateProjectAppRequest,
  UpdateProjectAppResponse,
} from "@budibase/types"
import sdk from "../../sdk"

function toProjectAppResponse(workspaceApp: WorkspaceApp): ProjectAppResponse {
  return {
    _id: workspaceApp._id!,
    _rev: workspaceApp._rev!,
    name: workspaceApp.name,
    urlPrefix: workspaceApp.urlPrefix,
    icon: workspaceApp.icon,
    iconColor: workspaceApp.iconColor,
  }
}

export async function create(
  ctx: Ctx<InsertProjectAppRequest, InsertProjectAppResponse>
) {
  const { body } = ctx.request
  const newProjectApp = {
    name: body.name,
    urlPrefix: body.urlPrefix,
    icon: body.icon,
    iconColor: body.iconColor,
  }

  const workspaceApp = await sdk.workspaceApps.create(newProjectApp)
  ctx.status = 201
  ctx.body = {
    workspaceApp: toProjectAppResponse(workspaceApp),
  }
}

export async function edit(
  ctx: Ctx<UpdateProjectAppRequest, UpdateProjectAppResponse>
) {
  const { body } = ctx.request

  if (ctx.params.id !== body._id) {
    ctx.throw("Path and body ids do not match", 400)
  }

  const toUpdate = {
    _id: body._id,
    _rev: body._rev,
    name: body.name,
    urlPrefix: body.urlPrefix,
    icon: body.icon,
    iconColor: body.iconColor,
  }

  const workspaceApp = await sdk.workspaceApps.update(toUpdate)
  ctx.body = {
    workspaceApp: toProjectAppResponse(workspaceApp),
  }
}

export async function remove(ctx: Ctx<void, void>) {
  const { id, rev } = ctx.params

  await sdk.workspaceApps.remove(id, rev)
  ctx.status = 204
}
