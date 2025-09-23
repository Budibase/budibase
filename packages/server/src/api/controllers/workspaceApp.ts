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
import { helpers } from "@budibase/shared-core"

function toWorkspaceAppResponse(
  workspaceApp: WorkspaceApp
): WorkspaceAppResponse {
  return {
    _id: workspaceApp._id!,
    _rev: workspaceApp._rev!,
    name: workspaceApp.name,
    url: workspaceApp.url,
    navigation: workspaceApp.navigation,
    isDefault: workspaceApp.isDefault,
    createdAt: workspaceApp.createdAt as string,
    updatedAt: workspaceApp.updatedAt!,
    disabled: workspaceApp.disabled,
  }
}

export async function fetch(ctx: Ctx<void, FetchWorkspaceAppResponse>) {
  const workspaceApps = await sdk.workspaceApps.fetch()
  ctx.body = {
    workspaceApps: workspaceApps.map(toWorkspaceAppResponse),
  }
}

const duplicateScreens = async (originalAppId: string, newAppId: string) => {
  const screens = await sdk.screens.fetch()

  const appScreens = screens.filter(s => s.workspaceAppId === originalAppId)
  const newScreens = []
  for (let i = 0; i < appScreens.length; i++) {
    const screen = appScreens[i]
    const createdScreen = await sdk.screens.create({
      ...{
        layoutId: screen.layoutId,
        showNavigation: screen.showNavigation,
        width: screen.width,
        routing: screen.routing,
        props: screen.props,
        name: screen.name,
        pluginAdded: screen.pluginAdded,
        onLoad: screen.onLoad,
        variant: screen.variant,
      },
      workspaceAppId: newAppId,
    })

    newScreens.push(createdScreen)
  }

  return newScreens
}

const createDuplicatedApp = async (workspaceApp: WorkspaceApp) => {
  const otherApps = await sdk.workspaceApps.fetch()

  const name = helpers.duplicateName(
    workspaceApp.name,
    otherApps.map(a => a.name)
  )

  const duplicatedAppData = {
    name,
    url: `/${slugify(name)}`,
    disabled: true,
    navigation: workspaceApp.navigation,
    isDefault: false,
  }

  const duplicatedApp = await sdk.workspaceApps.create(duplicatedAppData)

  return duplicatedApp
}

const slugify = (text: string) => text.toLowerCase().replaceAll(" ", "-")

export async function duplicate(
  ctx: Ctx<void, InsertWorkspaceAppResponse, { id: string }>
) {
  const { id } = ctx.params
  const workspaceApp = await sdk.workspaceApps.get(id)
  if (!workspaceApp) {
    ctx.throw(404)
  }

  const duplicatedApp = await createDuplicatedApp(workspaceApp)
  await duplicateScreens(
    workspaceApp._id as string,
    duplicatedApp._id as string
  )

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
  const newWorkspaceApp: WithoutDocMetadata<WorkspaceApp> = {
    name: body.name,
    url: body.url,
    disabled: body.disabled,
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
    navigation: body.navigation,
    disabled: body.disabled,
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
