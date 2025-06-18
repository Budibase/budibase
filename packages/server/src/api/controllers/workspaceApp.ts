import {
  Ctx,
  FetchWorkspaceAppResponse,
  InsertWorkspaceAppRequest,
  InsertWorkspaceAppResponse,
  UpdateWorkspaceAppRequest,
  UpdateWorkspaceAppResponse,
  WithoutDocMetadata,
  WorkspaceApp,
  WorkspaceAppResponse,
} from "@budibase/types"
import sdk from "../../sdk"
import { defaultAppNavigator } from "../../constants/definitions"

function toWorkspaceAppResponse(
  workspaceApp: WorkspaceApp
): WorkspaceAppResponse {
  return {
    _id: workspaceApp._id!,
    _rev: workspaceApp._rev!,
    name: workspaceApp.name,
    url: workspaceApp.url,
    icon: workspaceApp.icon,
    iconColor: workspaceApp.iconColor,
    navigation: workspaceApp.navigation,
    isDefault: workspaceApp.isDefault,
  }
}

export async function fetch(ctx: Ctx<void, FetchWorkspaceAppResponse>) {
  const workspaceApps = await sdk.workspaceApps.fetch()
  ctx.body = {
    workspaceApps: workspaceApps.map(toWorkspaceAppResponse),
  }
}

export async function create(
  ctx: Ctx<InsertWorkspaceAppRequest, InsertWorkspaceAppResponse>
) {
  const { body } = ctx.request
  const newWorkspaceApp: WithoutDocMetadata<WorkspaceApp> = {
    name: body.name,
    url: body.url,
    icon: body.icon,
    iconColor: body.iconColor,
    navigation: defaultAppNavigator(body.name),
    isDefault: false,
  }

  const workspaceApp = await sdk.workspaceApps.create(newWorkspaceApp)
  ctx.status = 201
  ctx.body = {
    workspaceApp: toWorkspaceAppResponse(workspaceApp),
  }
}

export async function edit(
  ctx: Ctx<UpdateWorkspaceAppRequest, UpdateWorkspaceAppResponse>
) {
  const { body } = ctx.request

  if (ctx.params.id !== body._id) {
    ctx.throw("Path and body ids do not match", 400)
  }

  const toUpdate = {
    _id: body._id,
    _rev: body._rev,
    name: body.name,
    url: body.url,
    icon: body.icon,
    iconColor: body.iconColor,
    navigation: body.navigation,
  }

  const workspaceApp = await sdk.workspaceApps.update(toUpdate)
  ctx.body = {
    workspaceApp: toWorkspaceAppResponse(workspaceApp),
  }
}

export async function remove(ctx: Ctx<void, void>) {
  const { id, rev } = ctx.params

  await sdk.workspaceApps.remove(id, rev)
  ctx.status = 204
}
