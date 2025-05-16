import {
  Ctx,
  InsertProjectAppRequest,
  InsertProjectAppResponse,
  ProjectApp,
  ProjectAppResponse,
  UpdateProjectAppRequest,
  UpdateProjectAppResponse,
} from "@budibase/types"
import sdk from "../../sdk"

function toProjectAppResponse(projectApp: ProjectApp): ProjectAppResponse {
  return {
    _id: projectApp._id!,
    _rev: projectApp._rev!,
    name: projectApp.name,
    urlPrefix: projectApp.urlPrefix,
    icon: projectApp.icon,
    iconColor: projectApp.iconColor,
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

  const projectApp = await sdk.workspaceApps.create(newProjectApp)
  ctx.status = 201
  ctx.body = {
    projectApp: toProjectAppResponse(projectApp),
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

  const projectApp = await sdk.workspaceApps.update(toUpdate)
  ctx.body = {
    projectApp: toProjectAppResponse(projectApp),
  }
}

export async function remove(ctx: Ctx<void, void>) {
  const { id, rev } = ctx.params

  await sdk.workspaceApps.remove(id, rev)
  ctx.status = 204
}
