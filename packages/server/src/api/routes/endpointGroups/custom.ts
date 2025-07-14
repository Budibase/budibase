import { EndpointGroup, CtxFn } from "@budibase/backend-core"

class CustomEndpointGroups {
  private groups: EndpointGroup[] = []

  group(...middlewares: (CtxFn | { middleware: CtxFn; start: boolean })[]) {
    const group = new EndpointGroup()
    if (middlewares.length) {
      middlewares.forEach(middleware => {
        if ("start" in middleware) {
          group.addGroupMiddleware(middleware.middleware, {
            start: middleware.start,
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
