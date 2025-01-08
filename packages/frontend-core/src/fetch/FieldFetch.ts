import { Row } from "@budibase/types"
import DataFetch from "./DataFetch"

export interface FieldDatasource {
  tableId: string
  fieldType: "attachment" | "array"
  value: string[] | Row[]
}

export interface FieldDefinition {
  schema?: Record<string, { type: string }> | null
}

function isArrayOfStrings(value: string[] | Row[]): value is string[] {
  return Array.isArray(value) && !!value[0] && typeof value[0] !== "object"
}

export default class FieldFetch extends DataFetch<
  FieldDatasource,
  FieldDefinition
> {
  async getDefinition(): Promise<FieldDefinition | null> {
    const { datasource } = this.options

    // Field sources have their schema statically defined
    let schema
    if (datasource.fieldType === "attachment") {
      schema = {
        url: {
          type: "string",
        },
        name: {
          type: "string",
        },
      }
    } else if (datasource.fieldType === "array") {
      schema = {
        value: {
          type: "string",
        },
      }
    }
    return { schema }
  }

  async getData() {
    const { datasource } = this.options

    // These sources will be available directly from context
    const data = datasource?.value || []
    let rows: Row[]
    if (isArrayOfStrings(data)) {
      rows = data.map(value => ({ value }))
    } else {
      rows = data
    }

    return {
      rows: rows || [],
      hasNextPage: false,
      cursor: null,
    }
  }
}
