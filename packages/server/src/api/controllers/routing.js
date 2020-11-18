const { getRoutingInfo } = require("../../utilities/routing")
const { AccessController } = require("../../utilities/security/accessLevels")

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

exports.fetch = async ctx => {
  ctx.body = await getRoutingStructure(ctx.appId)
}

exports.clientFetch = async ctx => {
  const routing = getRoutingStructure(ctx.appId)
  // use the access controller to pick which access level is applicable to this user
  const accessController = new AccessController(ctx.appId)
  // TODO: iterate through the routes and pick which the user can access
}
