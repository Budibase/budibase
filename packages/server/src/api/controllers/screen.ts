import { context, events, roles } from "@budibase/backend-core"
import { sdk as sharedSdk } from "@budibase/shared-core"
import {
  DeleteScreenResponse,
  FetchScreenResponse,
  Plugin,
  SaveScreenRequest,
  SaveScreenResponse,
  Screen,
  ScreenUsage,
  UsageInScreensResponse,
  UserCtx,
  Workspace,
} from "@budibase/types"
import { DocumentType } from "../../db/utils"
import sdk from "../../sdk"
import { builderSocket } from "../../websockets"

export async function fetch(ctx: UserCtx<void, FetchScreenResponse>) {
  const screens = await sdk.screens.fetch()

  const roleId = ctx.user?.role?._id as string
  if (!roleId) {
    ctx.throw("Unable to retrieve users role ID.")
  }
  ctx.body = await new roles.AccessController().checkScreensAccess(
    screens,
    roleId
  )
}

export async function save(
  ctx: UserCtx<SaveScreenRequest, SaveScreenResponse>
) {
  const db = context.getWorkspaceDB()
  const { navigationLinkLabel, ...screen } = ctx.request.body

  if (!(await sdk.workspaceApps.get(screen.workspaceAppId))) {
    ctx.throw(400, "Workspace app id not valid")
  }

  const isCreation = !screen._id

  const savedScreen = isCreation
    ? await sdk.screens.create(screen)
    : await sdk.screens.update(screen)

  const application = await db.get<Workspace>(DocumentType.WORKSPACE_METADATA)
  const prevIds = new Set(
    (application.usedPlugins || []).map((x: Plugin) => x._id)
  )

  const usedPlugins = await sdk.plugins.reconcileUsedPlugins(db)
  const pluginAdded = usedPlugins.some(plugin => !prevIds.has(plugin._id))

  if (screen.routing.homeScreen) {
    await sdk.screens.ensureHomepageUniqueness(screen)
  }

  if (isCreation) {
    await events.screen.created(screen)
  }

  if (navigationLinkLabel && isCreation) {
    await sdk.navigation.addLink({
      label: navigationLinkLabel,
      url: screen.routing.route,
      roleId: screen.routing.roleId,
      workspaceAppId: screen.workspaceAppId,
    })

    const workspaceApp = await sdk.workspaceApps.get(screen.workspaceAppId)
    if (workspaceApp) {
      builderSocket?.emitWorkspaceAppUpdate(ctx, workspaceApp)
    }
  }

  ctx.message = `Screen ${screen.name} saved.`
  ctx.body = {
    ...savedScreen,
    pluginAdded,
  }
  builderSocket?.emitScreenUpdate(ctx, savedScreen)
}

export async function destroy(ctx: UserCtx<void, DeleteScreenResponse>) {
  const db = context.getWorkspaceDB()
  const id = ctx.params.screenId
  const screen = await db.get<Screen>(id)

  await db.remove(id, ctx.params.screenRev)

  await sdk.navigation.deleteLink(screen.routing.route, screen.workspaceAppId)
  await sdk.plugins.reconcileUsedPlugins(db)

  await events.screen.deleted(screen)
  ctx.body = {
    message: "Screen deleted successfully",
  }
  builderSocket?.emitScreenDeletion(ctx, id)

  const workspaceApp = await sdk.workspaceApps.get(screen.workspaceAppId)
  if (workspaceApp) {
    builderSocket?.emitWorkspaceAppUpdate(ctx, workspaceApp)
  }
}

export async function usage(ctx: UserCtx<void, UsageInScreensResponse>) {
  const sourceId = ctx.params.sourceId
  const sourceType = sdk.common.getSourceType(sourceId)
  const allScreens = await sdk.screens.fetch()
  const response: ScreenUsage[] = []
  for (let screen of allScreens) {
    const found = sharedSdk.screens.findInSettings(screen, sourceId)
    if (found.length !== 0) {
      response.push({
        url: screen.routing.route,
        _id: screen._id!,
        workspaceAppId: screen.workspaceAppId,
      })
    }
  }
  ctx.body = {
    sourceType,
    screens: response,
  }
}
