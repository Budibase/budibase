import TableFetch from "./fetch/TableFetch.js"
import ViewFetch from "./fetch/ViewFetch.js"
import QueryFetch from "./fetch/QueryFetch.js"

/**
 * Fetches the schema of any kind of datasource.
 */
export const fetchDatasourceSchema = async datasource => {
  const type = datasource?.type

  // Nested providers should already have exposed their own schema
  if (type === "provider") {
    return datasource.value?.schema
  }

  // Field sources have their schema statically defined
  if (type === "field") {
    if (datasource.fieldType === "attachment") {
      return {
        url: {
          type: "string",
        },
        name: {
          type: "string",
        },
      }
    } else if (datasource.fieldType === "array") {
      return {
        value: {
          type: "string",
        },
      }
    }
  }

  // All normal datasource schema can use their corresponsing implementations
  // in the data fetch classes
  const handler = {
    table: TableFetch,
    link: TableFetch,
    view: ViewFetch,
    query: QueryFetch,
  }[type]
  if (handler) {
    const definition = await handler.getDefinition(datasource)
    return handler.getSchema(datasource, definition)
  }

  return null
}
