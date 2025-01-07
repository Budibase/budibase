import FieldFetch, { FieldDatasource } from "./FieldFetch"
import { getJSONArrayDatasourceSchema } from "../utils/json"

export default class JSONArrayFetch extends FieldFetch {
  async getDefinition(datasource: FieldDatasource) {
    // JSON arrays need their table definitions fetched.
    // We can then extract their schema as a subset of the table schema.
    try {
      const table = await this.API.fetchTableDefinition(datasource.tableId)
      const schema: Record<string, any> | null = getJSONArrayDatasourceSchema(
        table?.schema,
        datasource
      )
      return { schema }
    } catch (error) {
      return null
    }
  }
}
