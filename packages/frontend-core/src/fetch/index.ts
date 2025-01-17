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
import { DataFetchDatasource, Table, ViewV2Enriched } from "@budibase/types"

export type DataFetchType = keyof typeof DataFetchMap

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
  field: FieldFetch,
  jsonarray: JSONArrayFetch,
  queryarray: QueryArrayFetch,
}

export interface DataFetchClassMap {
  table: TableFetch
  view: ViewFetch
  viewV2: ViewV2Fetch
  query: QueryFetch
  link: RelationshipFetch
  user: UserFetch
  groupUser: GroupUserFetch
  custom: CustomFetch

  // Client specific datasource types
  provider: NestedProviderFetch
  field: FieldFetch
  jsonarray: JSONArrayFetch
  queryarray: QueryArrayFetch
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
  | FieldFetch
  | JSONArrayFetch
  | QueryArrayFetch

export type DataFetchDefinition =
  | Table
  | ViewV2Enriched
  | {
      // These fields are added to allow checking these fields on definition usages without requiring constant castings
      schema?: Record<string, any> | null
      primaryDisplay?: string
      rowHeight?: number
      type?: string
      name?: string
    }

// Constructs a new fetch model for a certain datasource
export const fetchData = <
  T extends DataFetchDatasource,
  Type extends T["type"] = T["type"]
>({
  API,
  datasource,
  options,
}: {
  API: APIClient
  datasource: T
  options: any
}): Type extends keyof DataFetchClassMap
  ? DataFetchClassMap[Type]
  : TableFetch => {
  const Fetch = DataFetchMap[datasource?.type] || TableFetch
  const fetch = new Fetch({ API, datasource, ...options })

  // Initially fetch data but don't bother waiting for the result
  fetch.getInitialData()

  return fetch as any
}

// Creates an empty fetch instance with no datasource configured, so no data
// will initially be loaded
const createEmptyFetchInstance = ({
  API,
  datasource,
}: {
  API: APIClient
  datasource: DataFetchDatasource
}) => {
  const handler = DataFetchMap[datasource?.type]
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
export const getDatasourceDefinition = async ({
  API,
  datasource,
}: {
  API: APIClient
  datasource: DataFetchDatasource
}) => {
  const instance = createEmptyFetchInstance({ API, datasource })
  return await instance?.getDefinition()
}

// Fetches the schema of any type of datasource
export const getDatasourceSchema = ({
  API,
  datasource,
  definition,
}: {
  API: APIClient
  datasource: DataFetchDatasource
  definition?: any
}) => {
  const instance = createEmptyFetchInstance({ API, datasource })
  return instance?.getSchema(definition)
}
