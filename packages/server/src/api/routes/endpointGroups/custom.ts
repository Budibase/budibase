import { EndpointGroup, CtxFn } from "@budibase/backend-core"

class CustomEndpointGroups {
  private groups: EndpointGroup[] = []

  group(...middlewares: CtxFn[]) {
    const group = new EndpointGroup()
    if (middlewares.length) {
      middlewares.forEach(middleware => {
        group.addGroupMiddleware(middleware)
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
