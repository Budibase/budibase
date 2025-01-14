import TableFetch from "./TableFetch"
import ViewFetch from "./ViewFetch"
import ViewV2Fetch from "./ViewV2Fetch"
import QueryFetch from "./QueryFetch"
import RelationshipFetch from "./RelationshipFetch"
import NestedProviderFetch from "./NestedProviderFetch"
import FieldFetch from "./FieldFetch"
import JSONArrayFetch from "./JSONArrayFetch"
import UserFetch from "./UserFetch"
import GroupUserFetch from "./GroupUserFetch"
import CustomFetch from "./CustomFetch"
import QueryArrayFetch from "./QueryArrayFetch"
import { APIClient } from "../api/types"
import { Table, ViewV2Enriched } from "@budibase/types"

export type DataFetchType = keyof typeof DataFetchMap
export type { DataFetchOptions } from "./DataFetch"

export const DataFetchMap = {
  table: TableFetch,
  view: ViewFetch,
  viewV2: ViewV2Fetch,
  query: QueryFetch,
  link: RelationshipFetch,
  user: UserFetch,
  groupUser: GroupUserFetch,
  custom: CustomFetch,

  // Client specific datasource types
  provider: NestedProviderFetch,
  field: FieldFetch<"field">,
  jsonarray: JSONArrayFetch,
  queryarray: QueryArrayFetch,
}

export type DataFetch =
  | TableFetch
  | ViewFetch
  | ViewV2Fetch
  | QueryFetch
  | RelationshipFetch
  | UserFetch
  | GroupUserFetch
  | CustomFetch
  | NestedProviderFetch
  | FieldFetch<"field">
  | JSONArrayFetch
  | QueryArrayFetch

export type DataFetchDefinition =
  | Table
  | ViewV2Enriched
  | {
      schema?: Record<string, any> | null
      primaryDisplay?: string
    }

// Constructs a new fetch model for a certain datasource
export const fetchData = <TDatasource extends { type: DataFetchType }>({
  API,
  datasource,
  options,
}: {
  API: APIClient
  datasource: TDatasource
  options: any
}) => {
  const Fetch = DataFetchMap[datasource?.type as DataFetchType] || TableFetch
  const fetch = new Fetch({ API, datasource, ...options })

  // Initially fetch data but don't bother waiting for the result
  fetch.getInitialData()

  return fetch
}

// Creates an empty fetch instance with no datasource configured, so no data
// will initially be loaded
const createEmptyFetchInstance = <TDatasource extends { type: DataFetchType }>({
  API,
  datasource,
}: {
  API: APIClient
  datasource: TDatasource
}) => {
  const handler = DataFetchMap[datasource?.type as DataFetchType]
  if (!handler) {
    return null
  }
  return new handler({
    API,
    datasource: null as never,
    query: null as any,
  })
}

// Fetches the definition of any type of datasource
export const getDatasourceDefinition = async <
  TDatasource extends { type: DataFetchType }
>({
  API,
  datasource,
}: {
  API: APIClient
  datasource: TDatasource
}) => {
  const instance = createEmptyFetchInstance({ API, datasource })
  return await instance?.getDefinition()
}

// Fetches the schema of any type of datasource
export const getDatasourceSchema = <
  TDatasource extends { type: DataFetchType }
>({
  API,
  datasource,
  definition,
}: {
  API: APIClient
  datasource: TDatasource
  definition?: any
}) => {
  const instance = createEmptyFetchInstance({ API, datasource })
  return instance?.getSchema(definition)
}
