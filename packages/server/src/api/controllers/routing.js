const { getRoutingInfo } = require("../../utilities/routing")
const {
  getUserAccessLevelHierarchy,
  BUILTIN_LEVEL_IDS,
} = require("../../utilities/security/accessLevels")

/**
 * Gets the full routing structure by querying the routing view and processing the result into the tree.
 * @param {string} appId The application to produce the routing structure for.
 * @returns {Promise<object>} The routing structure, this is the full structure designed for use in the builder,
 * if the client routing is required then the updateRoutingStructureForUserLevel should be used.
 */
async function getRoutingStructure(appId) {
  const screenRoutes = await getRoutingInfo(appId)
  const routing = {}
  for (let screenRoute of screenRoutes) {
    const fullpath = screenRoute.routing.route
    // replace the first value with the home route
    const subpaths = ["/"].concat(fullpath.split("/").splice(1))
    // special case for when it is simply the home route "/", this creates a weird scenario
    if (subpaths[1] === "") {
      subpaths.splice(1, 1)
    }
    const accessLevel = screenRoute.routing.accessLevelId
    // iterate through the tree initially to flesh out all the required subpaths
    let currentPath = routing,
      nextSubpath = routing
    for (let subpath of subpaths) {
      if (!nextSubpath[subpath]) {
        nextSubpath[subpath] = {
          subpaths: {},
        }
      }
      currentPath = nextSubpath ? nextSubpath : currentPath[subpath]
      nextSubpath = currentPath[subpath].subpaths
    }
    const correctPath = currentPath[subpaths[subpaths.length - 1]]
    if (!correctPath.screens) {
      correctPath.screens = {}
    }
    correctPath.screens[accessLevel] = screenRoute.id
    correctPath.fullpath = fullpath
  }

  return { routes: routing }
}

/**
 * A function for recursing through the routing structure and adjusting it to match the user's access level
 * @param {object} path The routing path, retrieved from the getRoutingStructure function, when this recurses it will
 * call with this parameter updated to the various subpaths.
 * @param {string[]} accessLevelIds The full list of access level IDs, this has to be passed in as otherwise we would
 * need to make this an async function purely for the first call, adds confusion to the recursion.
 * @returns {object} The routing structure after it has been updated.
 */
function updateRoutingStructureForUserLevel(path, accessLevelIds) {
  for (let routeKey of Object.keys(path)) {
    const pathStructure = path[routeKey]
    if (pathStructure.subpaths) {
      pathStructure.subpaths = updateRoutingStructureForUserLevel(
        pathStructure.subpaths,
        accessLevelIds
      )
    }
    if (pathStructure.screens) {
      const accessLevelOptions = Object.keys(pathStructure.screens)
      // starts with highest level and works down through inheritance
      let found = false
      // special case for when the screen has no access control
      if (accessLevelOptions.length === 1 && !accessLevelOptions[0]) {
        pathStructure.screenId = pathStructure.screens[accessLevelOptions[0]]
        pathStructure.accessLevelId = BUILTIN_LEVEL_IDS.BASIC
        found = true
      } else {
        for (let levelId of accessLevelIds) {
          if (accessLevelOptions.indexOf(levelId) !== -1) {
            pathStructure.screenId = pathStructure.screens[levelId]
            pathStructure.accessLevelId = levelId
            found = true
            break
          }
        }
      }
      // remove the screen options now that we've processed it
      delete pathStructure.screens
      // if no option was found then remove the route, user can't access it
      if (!found) {
        delete path[routeKey]
      }
    }
  }
  return path
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
  ctx.body = updateRoutingStructureForUserLevel(routing.routes, accessLevelIds)
}
