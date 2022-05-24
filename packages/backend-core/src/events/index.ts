import { processors } from "./processors"
export * from "./publishers"
export * as analytics from "./analytics"
export * as identification from "./identification"

export const shutdown = () => {
  processors.shutdown()
}
