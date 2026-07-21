import { EndpointGroup, CtxFn } from "./"
import type { EndpointGroupOptions } from "./EndpointGroup"
import type { EndpointMatcher } from "@budibase/types"

type GroupMiddleware = CtxFn | { middleware: CtxFn; first: boolean }

export default class EndpointGroupList {
  private groups: EndpointGroup[] = []

  group(...args: GroupMiddleware[]): EndpointGroup
  group(
    options: EndpointGroupOptions,
    ...middlewares: GroupMiddleware[]
  ): EndpointGroup
  group(
    optionsOrMiddleware?: EndpointGroupOptions | GroupMiddleware,
    ...remainingMiddlewares: GroupMiddleware[]
  ) {
    const isOptions =
      optionsOrMiddleware &&
      typeof optionsOrMiddleware === "object" &&
      !("middleware" in optionsOrMiddleware) &&
      ("public" in optionsOrMiddleware || "noTenancy" in optionsOrMiddleware)
    const options = isOptions ? optionsOrMiddleware : {}
    const middlewares = isOptions
      ? remainingMiddlewares
      : [optionsOrMiddleware, ...remainingMiddlewares].filter(
          (middleware): middleware is GroupMiddleware => !!middleware
        )
    const group = new EndpointGroup(options)
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

  endpointMatchers(options: EndpointGroupOptions): EndpointMatcher[] {
    return this.groups.flatMap(group => group.endpointMatchers(options))
  }
}
