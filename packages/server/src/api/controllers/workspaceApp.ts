import {
  Ctx,
  InsertWorkspaceAppRequest,
  InsertWorkspaceAppResponse,
  WorkspaceApp,
  WorkspaceAppResponse,
  UpdateWorkspaceAppRequest,
  UpdateWorkspaceAppResponse,
  WithoutDocMetadata,
} from "@budibase/types"
import sdk from "../../sdk"

function toWorkspaceAppResponse(
  workspaceApp: WorkspaceApp
): WorkspaceAppResponse {
  return {
    _id: workspaceApp._id!,
    _rev: workspaceApp._rev!,
    name: workspaceApp.name,
    urlPrefix: workspaceApp.urlPrefix,
    icon: workspaceApp.icon,
    iconColor: workspaceApp.iconColor,
    navigation: workspaceApp.navigation,
  }
}

export async function create(
  ctx: Ctx<InsertWorkspaceAppRequest, InsertWorkspaceAppResponse>
) {
  const { body } = ctx.request
  const newWorkspaceApp: WithoutDocMetadata<WorkspaceApp> = {
    name: body.name,
    urlPrefix: body.urlPrefix,
    icon: body.icon,
    iconColor: body.iconColor,
    navigation: {
      navigation: "Top",
      title: body.name,
      navWidth: "Large",
      navBackground: "var(--spectrum-global-color-static-blue-1200)",
      navTextColor: "var(--spectrum-global-color-static-white)",
      links: [],
    },
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
    urlPrefix: body.urlPrefix,
    icon: body.icon,
    iconColor: body.iconColor,
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
