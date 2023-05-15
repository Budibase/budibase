import { events } from "@budibase/backend-core"
import { getQueryParams } from "../../../../db/utils"
import { Query, Datasource, SourceName } from "@budibase/types"

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

export const backfill = async (appDb: any, timestamp: string | number) => {
  const queries: Query[] = await getQueries(appDb)

  for (const query of queries) {
    let datasource: Datasource

    try {
      datasource = await getDatasource(appDb, query.datasourceId)
    } catch (e: any) {
      // handle known bug where a datasource has been deleted
      // and the query has not
      if (e.status === 404) {
        datasource = {
          type: "unknown",
          _id: query.datasourceId,
          source: "unknown" as SourceName,
        }
      } else {
        throw e
      }
    }

    await events.query.created(datasource, query, timestamp)
  }

  return queries.length
}
