import TableFetch from "./TableFetch.js"
import ViewFetch from "./ViewFetch.js"
import ViewV2Fetch from "./ViewV2Fetch.js"
import QueryFetch from "./QueryFetch.js"
import RelationshipFetch from "./RelationshipFetch.js"
import NestedProviderFetch from "./NestedProviderFetch.js"
import FieldFetch from "./FieldFetch.js"
import JSONArrayFetch from "./JSONArrayFetch.js"
import UserFetch from "./UserFetch.js"
import GroupUserFetch from "./GroupUserFetch.js"
import CustomFetch from "./CustomFetch.js"
import QueryArrayFetch from "./QueryArrayFetch.js"

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
export const fetchData = ({ API, datasource, options }) => {
  const Fetch = DataFetchMap[datasource?.type] || TableFetch
  return new Fetch({ API, datasource, ...options })
}

// Creates an empty fetch instance with no datasource configured, so no data
// will initially be loaded
const createEmptyFetchInstance = ({ API, datasource }) => {
  const handler = DataFetchMap[datasource?.type]
  if (!handler) {
    return null
  }
  return new handler({ API })
}

// Fetches the definition of any type of datasource
export const getDatasourceDefinition = async ({ API, datasource }) => {
  const instance = createEmptyFetchInstance({ API, datasource })
  return await instance?.getDefinition(datasource)
}

// Fetches the schema of any type of datasource
export const getDatasourceSchema = ({ API, datasource, definition }) => {
  const instance = createEmptyFetchInstance({ API, datasource })
  return instance?.getSchema(datasource, definition)
}
