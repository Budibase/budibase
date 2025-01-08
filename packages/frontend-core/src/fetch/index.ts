import TableFetch from "./TableFetch.js"
import ViewFetch from "./ViewFetch.js"
import ViewV2Fetch from "./ViewV2Fetch.js"
import QueryFetch from "./QueryFetch"
import RelationshipFetch from "./RelationshipFetch"
import NestedProviderFetch from "./NestedProviderFetch"
import FieldFetch from "./FieldFetch"
import JSONArrayFetch from "./JSONArrayFetch"
import UserFetch from "./UserFetch.js"
import GroupUserFetch from "./GroupUserFetch"
import CustomFetch from "./CustomFetch"
import QueryArrayFetch from "./QueryArrayFetch.js"
import { APIClient } from "../api/types.js"

const DataFetchMap = {
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

// Constructs a new fetch model for a certain datasource
export const fetchData = ({ API, datasource, options }: any) => {
  const Fetch =
    DataFetchMap[datasource?.type as keyof typeof DataFetchMap] || TableFetch
  return new Fetch({ API, datasource, ...options })
}

// Creates an empty fetch instance with no datasource configured, so no data
// will initially be loaded
const createEmptyFetchInstance = <
  TDatasource extends {
    type: keyof typeof DataFetchMap
  }
>({
  API,
  datasource,
}: {
  API: APIClient
  datasource: TDatasource
}) => {
  const handler = DataFetchMap[datasource?.type as keyof typeof DataFetchMap]
  if (!handler) {
    return null
  }
  return new handler({ API, datasource: null as any, query: null as any })
}

// Fetches the definition of any type of datasource
export const getDatasourceDefinition = async <
  TDatasource extends {
    type: keyof typeof DataFetchMap
  }
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
  TDatasource extends {
    type: keyof typeof DataFetchMap
  }
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
