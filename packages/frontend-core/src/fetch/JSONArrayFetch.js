import { getJSONArrayDatasourceSchema } from "../utils/json"
import FieldFetch from "./FieldFetch.js"

export default class JSONArrayFetch extends FieldFetch {
  async getDefinition(datasource) {
    // JSON arrays need their table definitions fetched.
    // We can then extract their schema as a subset of the table schema.
    try {
      const table = await this.API.fetchTableDefinition(datasource.tableId)
      const schema = getJSONArrayDatasourceSchema(table?.schema, datasource)
      return { schema }
    } catch (_error) {
      return null
    }
  }
}
