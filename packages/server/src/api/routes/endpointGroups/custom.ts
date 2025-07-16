import { EndpointGroup, CtxFn } from "@budibase/backend-core"

class CustomEndpointGroups {
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

  list() {
    return this.groups
  }
}

export const customEndpointGroups = new CustomEndpointGroups()
