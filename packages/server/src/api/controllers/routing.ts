import { getRoutingInfo } from "../../utilities/routing"
import { roles } from "@budibase/backend-core"
import {
  FetchClientScreenRoutingResponse,
  FetchScreenRoutingResponse,
  ScreenRoutingJson,
  UserCtx,
} from "@budibase/types"

const URL_SEPARATOR = "/"

class Routing {
  json: ScreenRoutingJson

  constructor() {
    this.json = {}
  }

  getTopLevel(fullpath: string) {
    if (fullpath.charAt(0) !== URL_SEPARATOR) {
      fullpath = URL_SEPARATOR + fullpath
    }
    // replace the first value with the home route
    return URL_SEPARATOR + fullpath.split(URL_SEPARATOR)[1]
  }

  getScreensProp(fullpath: string) {
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

  addScreenId(fullpath: string, roleId: string, screenId: string) {
    this.getScreensProp(fullpath)[roleId] = screenId
  }
}

/**
 * Gets the full routing structure by querying the routing view and processing the result into the tree.
 * @returns The routing structure, this is the full structure designed for use in the builder,
 * if the client routing is required then the updateRoutingStructureForUserRole should be used.
 */
async function getRoutingStructure(): Promise<{ routes: ScreenRoutingJson }> {
  const screenRoutes = await getRoutingInfo()
  const routing = new Routing()

  for (let screenRoute of screenRoutes) {
    let fullpath = screenRoute.routing.route
    const roleId = screenRoute.routing.roleId
    routing.addScreenId(fullpath, roleId, screenRoute.id)
  }

  return { routes: routing.json }
}

export async function fetch(ctx: UserCtx<void, FetchScreenRoutingResponse>) {
  ctx.body = await getRoutingStructure()
}

export async function clientFetch(
  ctx: UserCtx<void, FetchClientScreenRoutingResponse>
) {
  const routing = await getRoutingStructure()
  let roleId = ctx.user?.role?._id
  const roleIds = roleId ? await roles.getUserRoleIdHierarchy(roleId) : []
  for (let topLevel of Object.values(routing.routes) as any) {
    for (let subpathKey of Object.keys(topLevel.subpaths)) {
      let found = false
      const subpath = topLevel.subpaths[subpathKey]
      const roleOptions = Object.keys(subpath.screens)
      if (roleOptions.length === 1 && !roleOptions[0]) {
        subpath.screenId = subpath.screens[roleOptions[0]]
        subpath.roleId = roles.BUILTIN_ROLE_IDS.BASIC
        found = true
      } else {
        for (let roleId of roleIds) {
          if (roleId && roleOptions.indexOf(roleId) !== -1) {
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
