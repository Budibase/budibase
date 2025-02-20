import fetch from "node-fetch"
import env from "../environment"
import { checkSlashesInUrl } from "./index"
import {
  FetchAppsResponse,
  FetchTablesResponse,
  FieldType,
  Row,
  SearchFilters,
  SearchResponse,
  SearchRowRequest,
} from "@budibase/types"
import { constants, env as coreEnv } from "@budibase/backend-core"

function headers(appId?: string) {
  const base: { headers: Record<string, string> } = {
    headers: {
      [constants.Header.API_KEY]: coreEnv.INTERNAL_API_KEY!,
      "content-type": "application/json",
    },
  }
  if (appId) {
    base.headers[constants.Header.APP_ID] = appId
  }
  return base
}

export async function getAppMetadata(): Promise<FetchAppsResponse> {
  const response = await fetch(
    checkSlashesInUrl(env.SERVER_URL + "/api/applications?status=all"),
    {
      method: "GET",
      ...headers(),
    }
  )
  return await response.json()
}

export async function getAppTables(
  appId: string
): Promise<FetchTablesResponse> {
  const response = await fetch(
    checkSlashesInUrl(env.SERVER_URL + "/api/tables"),
    {
      method: "GET",
      ...headers(appId),
    }
  )
  return await response.json()
}

export async function searchApp(
  appId: string,
  filters: { string: string[] }
): Promise<Row[]> {
  const tables = await getAppTables(appId)
  const promises: Promise<any>[] = []
  for (let table of tables) {
    const searchValue = filters.string
    const stringColumns = Object.values(table.schema).filter(
      schema =>
        schema.type === FieldType.STRING || schema.type === FieldType.OPTIONS
    )
    const searchParams: SearchRowRequest = {
      query: {
        $or: {
          conditions: stringColumns.map(col => ({
            string: { [col.name]: searchValue[0] },
          })),
        },
      },
    }
    const url = checkSlashesInUrl(env.SERVER_URL + `/api/${table._id!}/search`)
    promises.push(
      fetch(url, {
        method: "POST",
        body: JSON.stringify(searchParams),
        ...headers(appId),
      })
    )
  }
  const responses = await Promise.all(promises)
  const jsonPromises: Promise<SearchResponse<Row>>[] = responses.map(r =>
    r.json()
  )
  const json = await Promise.all(jsonPromises)
  return json.flatMap(j => j.rows)
}
