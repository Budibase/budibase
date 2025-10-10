export * as analytics from "./analytics"
export { asyncEventQueue } from "./asyncEvents"
export * as backfillCache from "./backfill"
export { publishEvent } from "./events"
export { default as identification } from "./identification"
export * as processors from "./processors"
export * from "./publishers"

import { processors } from "./processors"

export function initAsyncEvents() {}

export const shutdown = async () => {
  await processors.shutdown()
  console.log("Events shutdown")
}
