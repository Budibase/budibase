import FieldFetch from "./FieldFetch"
import { getJSONArrayDatasourceSchema } from "../utils/json"
import { JSONArrayFieldDatasource } from "@budibase/types"

export default class JSONArrayFetch extends FieldFetch<JSONArrayFieldDatasource> {
  async getDefinition() {
    const { datasource } = this.options

    // JSON arrays need their table definitions fetched.
    // We can then extract their schema as a subset of the table schema.
    try {
      const table = await this.API.fetchTableDefinition(datasource.tableId)
      const schema = getJSONArrayDatasourceSchema(table?.schema, datasource)
      return { schema }
    } catch (error) {
      return null
    }
  }
}
