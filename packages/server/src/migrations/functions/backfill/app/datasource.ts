import { events, db } from "@budibase/backend-core"
import { Datasource } from "@budibase/types"

export const backfill = async (appDb: any) => {
  const datasources: Datasource[] = []

  for (const datasource of datasources) {
    events.datasource.created(datasource)
  }
}
