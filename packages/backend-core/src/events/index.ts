export * from "./publishers"

import { processors } from "./processors"

export const shutdown = () => {
  processors.shutdown()
}
