import TableFetch from "./TableFetch.js"
import ViewFetch from "./ViewFetch.js"
import QueryFetch from "./QueryFetch.js"
import RelationshipFetch from "./RelationshipFetch.js"
import NestedProviderFetch from "./NestedProviderFetch.js"
import FieldFetch from "./FieldFetch.js"
import JSONArrayFetch from "./JSONArrayFetch.js"

const DataFetchMap = {
  table: TableFetch,
  view: ViewFetch,
  query: QueryFetch,
  link: RelationshipFetch,
  provider: NestedProviderFetch,
  field: FieldFetch,
  jsonarray: JSONArrayFetch,
}

export const fetchData = (datasource, options) => {
  const Fetch = DataFetchMap[datasource?.type] || TableFetch
  return new Fetch({ datasource, ...options })
}
