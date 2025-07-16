export * from "./custom"
export * from "./standard"

import { customEndpointGroups } from "./custom"

export function allRoutes() {
  return customEndpointGroups.list()
}
