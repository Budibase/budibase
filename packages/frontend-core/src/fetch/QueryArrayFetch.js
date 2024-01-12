import FieldFetch from "./FieldFetch.js"
import { getJSONArrayDatasourceSchema } from "../utils/json"

export default class QueryArrayFetch extends FieldFetch {
  async getDefinition(datasource) {
    if (!datasource?.tableId) {
      return null
    }
    // JSON arrays need their table definitions fetched.
    // We can then extract their schema as a subset of the table schema.
    try {
      const table = await this.API.fetchQueryDefinition(datasource.tableId)
      const schema = getJSONArrayDatasourceSchema(table?.schema, datasource)
      return { schema }
    } catch (error) {
      return null
    }
  }
}
