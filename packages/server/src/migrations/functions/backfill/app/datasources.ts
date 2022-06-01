import { events } from "@budibase/backend-core"
import { getDatasourceParams } from "../../../../db/utils"
import { Datasource } from "@budibase/types"

const getDatasources = async (appDb: any): Promise<Datasource[]> => {
  const response = await appDb.allDocs(
    getDatasourceParams(null, {
      include_docs: true,
    })
  )
  return response.rows.map((row: any) => row.doc)
}

export const backfill = async (appDb: any, timestamp: string | number) => {
  const datasources: Datasource[] = await getDatasources(appDb)

  for (const datasource of datasources) {
    await events.datasource.created(datasource, timestamp)
  }

  return datasources.length
}
