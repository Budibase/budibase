export * from "./publishers"
export * as processors from "./processors"
export * as analytics from "./analytics"
export { default as identification } from "./identification"
export * as backfillCache from "./backfill"

import { processors } from "./processors"

export function initAsyncEvents() {}

export const shutdown = () => {
  processors.shutdown()
  console.log("Events shutdown")
}
