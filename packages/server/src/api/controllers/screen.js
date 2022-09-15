const {
  getScreenParams,
  generateScreenID,
  getPluginParams,
  DocumentType,
} = require("../../db/utils")
const { AccessController } = require("@budibase/backend-core/roles")
const { getAppDB } = require("@budibase/backend-core/context")
const { events } = require("@budibase/backend-core")
const { getGlobalDB } = require("@budibase/backend-core/tenancy")
const { updateAppPackage } = require("./application")

exports.fetch = async ctx => {
  const db = getAppDB()

  const screens = (
    await db.allDocs(
      getScreenParams(null, {
        include_docs: true,
      })
    )
  ).rows.map(element => element.doc)

  ctx.body = await new AccessController().checkScreensAccess(
    screens,
    ctx.user.role._id
  )
}

exports.save = async ctx => {
  const db = getAppDB()
  let screen = ctx.request.body

  let eventFn
  if (!screen._id) {
    screen._id = generateScreenID()
    eventFn = events.screen.created
  }

  const response = await db.put(screen)

  // Find any custom components being used
  let pluginNames = []
  let pluginAdded = false
  findPlugins(screen.props, pluginNames)
  if (pluginNames.length) {
    const globalDB = getGlobalDB()
    const pluginsResponse = await globalDB.allDocs(
      getPluginParams(null, {
        include_docs: true,
      })
    )
    const requiredPlugins = pluginsResponse.rows
      .map(row => row.doc)
      .filter(plugin => {
        return (
          plugin.schema.type === "component" &&
          pluginNames.includes(`plugin/${plugin.name}`)
        )
      })

    // Update the app metadata
    const application = await db.get(DocumentType.APP_METADATA)
    let usedPlugins = application.usedPlugins || []

    requiredPlugins.forEach(plugin => {
      if (!usedPlugins.find(x => x._id === plugin._id)) {
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
  ctx.message = `Screen ${screen.name} saved.`
  ctx.body = {
    ...screen,
    _id: response.id,
    _rev: response.rev,
    pluginAdded,
  }
}

exports.destroy = async ctx => {
  const db = getAppDB()
  const id = ctx.params.screenId
  const screen = await db.get(id)

  await db.remove(id, ctx.params.screenRev)

  await events.screen.deleted(screen)
  ctx.body = {
    message: "Screen deleted successfully",
  }
  ctx.status = 200
}

const findPlugins = (component, foundPlugins) => {
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
