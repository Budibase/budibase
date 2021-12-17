import TableFetch from "./TableFetch.js"
import ViewFetch from "./ViewFetch.js"
import QueryFetch from "./QueryFetch.js"
import RelationshipFetch from "./RelationshipFetch.js"

const DataFetchMap = {
  table: TableFetch,
  view: ViewFetch,
  query: QueryFetch,
  link: RelationshipFetch,
}

export const fetchData = (datasource, options) => {
  const Fetch = DataFetchMap[datasource?.type] || TableFetch
  return new Fetch({ datasource, ...options })
}
