import { EndpointGroup, CtxFn } from "./"

export default class EndpointGroupList {
  private groups: EndpointGroup[] = []

  group(...middlewares: (CtxFn | { middleware: CtxFn; first: boolean })[]) {
    const group = new EndpointGroup()
    if (middlewares.length) {
      middlewares.forEach(middleware => {
        if ("first" in middleware) {
          group.addGroupMiddleware(middleware.middleware, {
            first: middleware.first,
          })
        } else {
          group.addGroupMiddleware(middleware)
        }
      })
    }
    this.groups.push(group)
    return group
  }

  listAllEndpoints() {
    const endpoints = this.groups.flatMap(group => group.endpointList())
    // sort endpoints with a URL parameters after the static endpoints -
    // for example, endpoints /api/queries/:queryId and /api/queries/accessible
    // can overlap, if the parameter comes before the accessible it'll be unreachable
    endpoints.sort((a, b) => {
      const aHasColon = a.url.includes(":")
      const bHasColon = b.url.includes(":")

      if (aHasColon && !bHasColon) return 1
      if (!aHasColon && bHasColon) return -1
      return a.url.localeCompare(b.url)
    })
    return endpoints
  }
}
