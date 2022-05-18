import { events, db } from "@budibase/backend-core"
import { Query, Datasource } from "@budibase/types"

export const backfill = async (appDb: any) => {
  const queries: Query[] = []

  for (const query of queries) {
    const datasource: Datasource = {}
    events.query.created(datasource, query)
  }
}
