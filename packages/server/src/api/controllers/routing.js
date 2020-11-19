const { getRoutingInfo } = require("../../utilities/routing")
const {
  getUserAccessLevelHierarchy,
  BUILTIN_LEVEL_IDS,
} = require("../../utilities/security/accessLevels")

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

Routing.prototype.addScreenId = function(fullpath, accessLevel, screenId) {
  this.getScreensProp(fullpath)[accessLevel] = screenId
}

/**
 * Gets the full routing structure by querying the routing view and processing the result into the tree.
 * @param {string} appId The application to produce the routing structure for.
 * @returns {Promise<object>} The routing structure, this is the full structure designed for use in the builder,
 * if the client routing is required then the updateRoutingStructureForUserLevel should be used.
 */
async function getRoutingStructure(appId) {
  const screenRoutes = await getRoutingInfo(appId)
  const routing = new Routing()

  for (let screenRoute of screenRoutes) {
    let fullpath = screenRoute.routing.route
    const accessLevel = screenRoute.routing.accessLevelId
    routing.addScreenId(fullpath, accessLevel, screenRoute.id)
  }

  return { routes: routing.json }
}

exports.fetch = async ctx => {
  ctx.body = await getRoutingStructure(ctx.appId)
}

exports.clientFetch = async ctx => {
  const routing = await getRoutingStructure(ctx.appId)
  const accessLevelId = ctx.user.accessLevel._id
  // builder is a special case, always return the full routing structure
  if (accessLevelId === BUILTIN_LEVEL_IDS.BUILDER) {
    ctx.body = routing
    return
  }
  const accessLevelIds = await getUserAccessLevelHierarchy(
    ctx.appId,
    accessLevelId
  )
  for (let topLevel of Object.values(routing.routes)) {
    for (let subpathKey of Object.keys(topLevel.subpaths)) {
      let found = false
      const subpath = topLevel.subpaths[subpathKey]
      const accessLevelOptions = Object.keys(subpath.screens)
      if (accessLevelOptions.length === 1 && !accessLevelOptions[0]) {
        subpath.screenId = subpath.screens[accessLevelOptions[0]]
        subpath.accessLevelId = BUILTIN_LEVEL_IDS.BASIC
        found = true
      } else {
        for (let levelId of accessLevelIds) {
          if (accessLevelOptions.indexOf(levelId) !== -1) {
            subpath.screenId = subpath.screens[levelId]
            subpath.accessLevelId = levelId
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
