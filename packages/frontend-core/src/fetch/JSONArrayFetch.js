import FieldFetch from "./FieldFetch.js"
import { getJSONArrayDatasourceSchema } from "../utils/json"

export default class JSONArrayFetch extends FieldFetch {
  async getDefinition(datasource) {
    // JSON arrays need their table definitions fetched.
    // We can then extract their schema as a subset of the table schema.
    try {
      let table
      if (datasource.tableId?.startsWith("query")) {
        table = await this.API.fetchQueryDefinition(datasource.tableId)
      } else {
        table = await this.API.fetchTableDefinition(datasource.tableId)
      }
      const schema = getJSONArrayDatasourceSchema(table?.schema, datasource)
      return { schema }
    } catch (error) {
      return null
    }
  }
}
