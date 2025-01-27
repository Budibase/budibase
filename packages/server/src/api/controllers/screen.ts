import { getScreenParams, generateScreenID, DocumentType } from "../../db/utils"
import {
  events,
  context,
  tenancy,
  db as dbCore,
  roles,
} from "@budibase/backend-core"
import { updateAppPackage } from "./application"
import {
  Plugin,
  ScreenProps,
  Screen,
  UserCtx,
  FetchScreenResponse,
  SaveScreenRequest,
  SaveScreenResponse,
  DeleteScreenResponse,
} from "@budibase/types"
import { builderSocket } from "../../websockets"

export async function fetch(ctx: UserCtx<void, FetchScreenResponse>) {
  const db = context.getAppDB()

  const screens = (
    await db.allDocs(
      getScreenParams(null, {
        include_docs: true,
      })
    )
  ).rows.map((el: any) => el.doc)

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
  const db = context.getAppDB()
  let screen = ctx.request.body

  let eventFn
  if (!screen._id) {
    screen._id = generateScreenID()
    eventFn = events.screen.created
  }

  const response = await db.put(screen)

  // Find any custom components being used
  let pluginNames: string[] = []
  let pluginAdded = false
  findPlugins(screen.props, pluginNames)
  if (pluginNames.length) {
    const globalDB = tenancy.getGlobalDB()
    const pluginsResponse = await globalDB.allDocs(
      dbCore.getPluginParams(null, {
        include_docs: true,
      })
    )
    const requiredPlugins = pluginsResponse.rows
      .map((row: any) => row.doc)
      .filter((plugin: Plugin) => {
        return (
          plugin.schema.type === "component" &&
          pluginNames.includes(`plugin/${plugin.name}`)
        )
      })

    // Update the app metadata
    const application = await db.get<any>(DocumentType.APP_METADATA)
    let usedPlugins = application.usedPlugins || []

    requiredPlugins.forEach((plugin: Plugin) => {
      if (!usedPlugins.find((x: Plugin) => x._id === plugin._id)) {
        pluginAdded = true
        usedPlugins.push({
          _id: plugin._id,
          name: plugin.name,
          version: plugin.version,
          jsUrl: plugin.jsUrl,
          hash: plugin.hash,
        })
      }
    })

    if (pluginAdded) {
      await updateAppPackage({ usedPlugins }, ctx.appId)
    }
  }

  if (eventFn) {
    await eventFn(screen)
  }
  const savedScreen = {
    ...screen,
    _id: response.id,
    _rev: response.rev,
  }
  ctx.message = `Screen ${screen.name} saved.`
  ctx.body = {
    ...savedScreen,
    pluginAdded,
  }
  builderSocket?.emitScreenUpdate(ctx, savedScreen)
}

export async function destroy(ctx: UserCtx<void, DeleteScreenResponse>) {
  const db = context.getAppDB()
  const id = ctx.params.screenId
  const screen = await db.get<Screen>(id)

  await db.remove(id, ctx.params.screenRev)

  await events.screen.deleted(screen)
  ctx.body = {
    message: "Screen deleted successfully",
  }
  builderSocket?.emitScreenDeletion(ctx, id)
}

function findPlugins(component: ScreenProps, foundPlugins: string[]) {
  if (!component) {
    return
  }
  if (component._component.startsWith("plugin")) {
    if (!foundPlugins.includes(component._component)) {
      foundPlugins.push(component._component)
    }
  }
  if (!component._children || !component._children.length) {
    return
  }
  component._children.forEach(child => findPlugins(child, foundPlugins))
}
