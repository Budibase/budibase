import { processors } from "./processors"
export * from "./publishers"
export * as analytics from "./analytics"

export const shutdown = () => {
  processors.shutdown()
}
