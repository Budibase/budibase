import { context, events, roles } from "@budibase/backend-core"
import { sdk as sharedSdk } from "@budibase/shared-core"
import {
  DeleteScreenResponse,
  FetchScreenResponse,
  SaveScreenRequest,
  SaveScreenResponse,
  Screen,
  ScreenUsage,
  UsageInScreensResponse,
  UserCtx,
} from "@budibase/types"
import sdk from "../../sdk"
import { propagateProjectDependencyChangesWithWarning } from "../../utilities/projects"
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

async function saveUnlocked(
  ctx: UserCtx<SaveScreenRequest, SaveScreenResponse>
) {
  const db = context.getWorkspaceDB()
  const { navigationLinkLabel, ...screen } = ctx.request.body

  const owningWorkspaceApp = await sdk.workspaceApps.get(screen.workspaceAppId)
  if (!owningWorkspaceApp) {
    ctx.throw(400, "Workspace app id not valid")
  }

  const isCreation = !screen._id
  const storedScreen = isCreation
    ? undefined
    : await db.get<Screen>(screen._id!)
  // Fetch applies the existing default-app repair for ownerless screens.
  const previousScreen =
    storedScreen && !storedScreen.workspaceAppId
      ? (await sdk.screens.fetch()).find(({ _id }) => _id === storedScreen._id)
      : storedScreen

  const savedScreen = isCreation
    ? await sdk.screens.create(screen)
    : await sdk.screens.update(screen)

  // Screens don't carry their own projectIds - resources they reference
  // (e.g. a button that triggers an automation) are attributed to the owning
  // workspace app in the dependency graph, so propagate from there.
  await propagateProjectDependencyChangesWithWarning({
    ctx,
    rootResourceId: owningWorkspaceApp._id!,
    currentProjectIds: owningWorkspaceApp.projectIds,
    previousProjectIds: owningWorkspaceApp.projectIds,
    previousResource:
      previousScreen?.workspaceAppId === owningWorkspaceApp._id
        ? previousScreen
        : undefined,
    savedResource: savedScreen,
  })

  const pluginAdded = await sdk.plugins.addUsedPluginsForScreen(
    screen.props,
    ctx.appId
  )

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

export async function save(
  ctx: UserCtx<SaveScreenRequest, SaveScreenResponse>
) {
  await sdk.projects.doWithProjectAssignmentsLockIfEnabled(() =>
    saveUnlocked(ctx)
  )
}

export async function destroy(ctx: UserCtx<void, DeleteScreenResponse>) {
  const db = context.getWorkspaceDB()
  const id = ctx.params.screenId
  const screen = await db.get<Screen>(id)

  await db.remove(id, ctx.params.screenRev)

  await sdk.navigation.deleteLink(screen.routing.route, screen.workspaceAppId)

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
