import FieldFetch from "./FieldFetch.js"
import { getJSONArrayDatasourceSchema } from "../utils/json"

export default class QueryArrayFetch extends FieldFetch {
  isObject(test) {
    return (
      typeof test === "object" &&
      !Array.isArray(test) &&
      test !== null &&
      !(test instanceof Date)
    )
  }

  generateArraySchemas(schema, nestedSchemaFields) {
    for (let key in schema) {
      if (
        schema[key] === "queryarray" &&
        this.isObject(nestedSchemaFields[key])
      ) {
        schema[key] = {
          schema: {
            schema: Object.entries(nestedSchemaFields[key] || {}).reduce(
              (acc, [nestedKey, nestedType]) => {
                acc[nestedKey] = {
                  name: nestedKey,
                  type: nestedType,
                }
                return acc
              },
              {}
            ),
            type: "json",
          },
          type: "queryarray",
        }
      }
    }
    return schema
  }

  async getDefinition(datasource) {
    if (!datasource?.tableId) {
      return null
    }
    // JSON arrays need their table definitions fetched.
    // We can then extract their schema as a subset of the table schema.
    try {
      const table = await this.API.fetchQueryDefinition(datasource.tableId)
      const schema = this.generateArraySchemas(
        table?.schema,
        table?.nestedSchemaFields
      )
      return { schema: getJSONArrayDatasourceSchema(schema, datasource) }
    } catch (error) {
      return null
    }
  }
}
