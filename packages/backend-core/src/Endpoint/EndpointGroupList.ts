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
    // maintain original order within each group (static vs parameterized)
    const staticEndpoints = []
    const parameterizedEndpoints = []

    for (const endpoint of endpoints) {
      if (endpoint.url.includes(":")) {
        parameterizedEndpoints.push(endpoint)
      } else {
        staticEndpoints.push(endpoint)
      }
    }

    return [...staticEndpoints, ...parameterizedEndpoints]
  }
}
