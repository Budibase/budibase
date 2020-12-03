const { getRoutingInfo } = require("../../utilities/routing")
const {
  getUserRoleHierarchy,
  BUILTIN_ROLE_IDS,
} = require("../../utilities/security/roles")

const URL_SEPARATOR = "/"

function Routing() {
  this.json = {}
}

Routing.prototype.getTopLevel = function(fullpath) {
  if (fullpath.charAt(0) !== URL_SEPARATOR) {
    fullpath = URL_SEPARATOR + fullpath
  }
  // replace the first value with the home route
  return URL_SEPARATOR + fullpath.split(URL_SEPARATOR)[1]
}

Routing.prototype.getScreensProp = function(fullpath) {
  const topLevel = this.getTopLevel(fullpath)
  if (!this.json[topLevel]) {
    this.json[topLevel] = {
      subpaths: {},
    }
  }
  if (!this.json[topLevel].subpaths[fullpath]) {
    this.json[topLevel].subpaths[fullpath] = {
      screens: {},
    }
  }
  return this.json[topLevel].subpaths[fullpath].screens
}

Routing.prototype.addScreenId = function(fullpath, roleId, screenId) {
  this.getScreensProp(fullpath)[roleId] = screenId
}

/**
 * Gets the full routing structure by querying the routing view and processing the result into the tree.
 * @param {string} appId The application to produce the routing structure for.
 * @returns {Promise<object>} The routing structure, this is the full structure designed for use in the builder,
 * if the client routing is required then the updateRoutingStructureForUserRole should be used.
 */
async function getRoutingStructure(appId) {
  const screenRoutes = await getRoutingInfo(appId)
  const routing = new Routing()

  for (let screenRoute of screenRoutes) {
    let fullpath = screenRoute.routing.route
    const roleId = screenRoute.routing.roleId
    routing.addScreenId(fullpath, roleId, screenRoute.id)
  }

  return { routes: routing.json }
}

exports.fetch = async ctx => {
  ctx.body = await getRoutingStructure(ctx.appId)
}

exports.clientFetch = async ctx => {
  const routing = await getRoutingStructure(ctx.appId)
  let roleId = ctx.user.role._id
  // builder is a special case, always return the full routing structure
  if (roleId === BUILTIN_ROLE_IDS.BUILDER) {
    roleId = BUILTIN_ROLE_IDS.ADMIN
  }
  const roleIds = await getUserRoleHierarchy(ctx.appId, roleId)
  for (let topLevel of Object.values(routing.routes)) {
    for (let subpathKey of Object.keys(topLevel.subpaths)) {
      let found = false
      const subpath = topLevel.subpaths[subpathKey]
      const roleOptions = Object.keys(subpath.screens)
      if (roleOptions.length === 1 && !roleOptions[0]) {
        subpath.screenId = subpath.screens[roleOptions[0]]
        subpath.roleId = BUILTIN_ROLE_IDS.BASIC
        found = true
      } else {
        for (let roleId of roleIds) {
          if (roleOptions.indexOf(roleId) !== -1) {
            subpath.screenId = subpath.screens[roleId]
            subpath.roleId = roleId
            found = true
            break
          }
        }
      }
      delete subpath.screens
      if (!found) {
        delete topLevel.subpaths[subpathKey]
      }
    }
  }
  ctx.body = routing
}
