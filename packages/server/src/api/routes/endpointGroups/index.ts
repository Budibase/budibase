export * from "./standard"
export * from "./custom"

import { customEndpointGroups } from "./custom"

export function allRoutes() {
  return customEndpointGroups.list()
}
