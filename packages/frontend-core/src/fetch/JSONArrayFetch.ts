import FieldFetch from "./FieldFetch"
import { getJSONArrayDatasourceSchema } from "../utils/json"
import { JSONArrayFieldDatasource } from "@budibase/types"

export default class JSONArrayFetch extends FieldFetch<JSONArrayFieldDatasource> {
  async getDefinition() {
    const { datasource } = this.options

    // JSON arrays need their table definitions fetched.
    // We can then extract their schema as a subset of the table schema.
    try {
      const { fieldName } = datasource
      const table = await this.API.fetchTableDefinition(datasource.tableId)

      // For Postgres JSON columns, the schema may be directly available on the field
      // Otherwise, fall back to fetching the schema
      const schema =
        table.schema?.[fieldName]?.schema ??
        getJSONArrayDatasourceSchema(table.schema, datasource)

      return { schema }
    } catch (error) {
      return null
    }
  }
}
