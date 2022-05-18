import { events, db } from "@budibase/backend-core"
import { Layout } from "@budibase/types"

export const backfill = async (appDb: any) => {
  const layouts: Layout[] = []

  for (const layout of layouts) {
    events.layout.created(layout)
  }
}
