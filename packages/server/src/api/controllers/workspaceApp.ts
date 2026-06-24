import { DefaultNewAppFontFamily } from "@budibase/shared-core"
import {
  Ctx,
  FetchWorkspaceAppResponse,
  FindWorkspaceAppResponse,
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
import {
  resolveProjectIds,
  resolveUpdatedProjectIds,
} from "../../utilities/projects"

const hasOwn = (obj: object, key: string) =>
  Object.prototype.hasOwnProperty.call(obj, key)

function toWorkspaceAppResponse(
  workspaceApp: WorkspaceApp
): WorkspaceAppResponse {
  return {
    _id: workspaceApp._id!,
    _rev: workspaceApp._rev!,
    name: workspaceApp.name,
    url: workspaceApp.url,
    navigation: workspaceApp.navigation,
    theme: workspaceApp.theme,
    customTheme: workspaceApp.customTheme,
    isDefault: workspaceApp.isDefault,
    createdAt: workspaceApp.createdAt as string,
    updatedAt: workspaceApp.updatedAt!,
    disabled: workspaceApp.disabled,
    projectIds: workspaceApp.projectIds,
  }
}

export async function fetch(ctx: Ctx<void, FetchWorkspaceAppResponse>) {
  const workspaceApps = await sdk.workspaceApps.fetch()
  ctx.body = {
    workspaceApps: workspaceApps.map(toWorkspaceAppResponse),
  }
}

export async function duplicate(
  ctx: Ctx<void, InsertWorkspaceAppResponse, { id: string }>
) {
  const { id } = ctx.params
  const workspaceApp = await sdk.workspaceApps.get(id)
  if (!workspaceApp) {
    ctx.throw(404)
  }

  const duplicatedApp = await sdk.workspaceApps.duplicate(workspaceApp)

  ctx.message = `App ${workspaceApp.name} duplicated successfully.`
  ctx.body = { workspaceApp: toWorkspaceAppResponse(duplicatedApp) }
  ctx.status = 201
}

export async function find(
  ctx: Ctx<void, FindWorkspaceAppResponse, { id: string }>
) {
  const { id } = ctx.params
  const workspaceApp = await sdk.workspaceApps.get(id)
  if (!workspaceApp) {
    ctx.throw(404)
  }

  ctx.body = toWorkspaceAppResponse(workspaceApp)
}

export async function create(
  ctx: Ctx<InsertWorkspaceAppRequest, InsertWorkspaceAppResponse>
) {
  const { body } = ctx.request
  const projectIds = await resolveProjectIds(body.projectIds)
  const newWorkspaceApp: WithoutDocMetadata<WorkspaceApp> = {
    name: body.name,
    url: body.url,
    disabled: body.disabled,
    projectIds,
    navigation: defaultAppNavigator(body.name),
    customTheme: {
      fontFamily: DefaultNewAppFontFamily,
    },
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
    ctx.throw(400, "Path and body ids do not match")
  }

  const existingWorkspaceApp = await sdk.workspaceApps.get(body._id)
  if (!existingWorkspaceApp) {
    ctx.throw(404)
  }

  const projectIds = await resolveUpdatedProjectIds(
    body.projectIds,
    existingWorkspaceApp.projectIds
  )

  const workspaceApp = await sdk.workspaceApps.update({
    _id: body._id,
    _rev: body._rev,
    name: body.name,
    url: body.url,
    navigation: body.navigation,
    disabled: body.disabled,
    projectIds,
    ...(hasOwn(body, "theme") ? { theme: body.theme } : {}),
    ...(hasOwn(body, "customTheme") ? { customTheme: body.customTheme } : {}),
  })
  ctx.body = {
    workspaceApp: toWorkspaceAppResponse(workspaceApp),
  }
}

export async function remove(ctx: Ctx<void, void>) {
  const { id, rev } = ctx.params

  await sdk.workspaceApps.remove(id, rev)
  ctx.status = 204
}
