import { processors } from "./processors"
export * from "./publishers"

export const shutdown = () => {
  processors.shutdown()
}

export const analyticsEnabled = () => {
  return true
}
