import { events, db } from "@budibase/backend-core"
import { getQueryParams } from "../../../../db/utils"
import { Query, Datasource } from "@budibase/types"

const getQueries = async (appDb: any): Promise<Query[]> => {
  const response = await appDb.allDocs(
    getQueryParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

const getDatasource = async (
  appDb: any,
  datasourceId: string
): Promise<Datasource> => {
  return appDb.get(datasourceId)
}

export const backfill = async (appDb: any) => {
  if (db.isDevAppID(appDb.name)) {
    const queries: Query[] = await getQueries(appDb)

    for (const query of queries) {
      const datasource: Datasource = await getDatasource(
        appDb,
        query.datasourceId
      )
      await events.query.created(datasource, query)
    }
  }
}
