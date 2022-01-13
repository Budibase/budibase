import FieldFetch from "./FieldFetch.js"
import { fetchTableDefinition } from "api"
import { getJSONArrayDatasourceSchema } from "builder/src/builderStore/jsonUtils"

export default class JSONArrayFetch extends FieldFetch {
  static async getDefinition(datasource) {
    // JSON arrays need their table definitions fetched.
    // We can then extract their schema as a subset of the table schema.
    const table = await fetchTableDefinition(datasource.tableId)
    const schema = getJSONArrayDatasourceSchema(table?.schema, datasource)
    return { schema }
  }
}
