import { Row, TableSchema } from "@budibase/types"
import DataFetch from "./DataFetch"

interface NestedProviderDatasource {
  type: "provider"
  value?: {
    schema: TableSchema
    primaryDisplay: string
    rows: Row[]
  }
}

interface NestedProviderDefinition {
  schema?: TableSchema
  primaryDisplay?: string
}
export default class NestedProviderFetch extends DataFetch<
  NestedProviderDatasource,
  NestedProviderDefinition
> {
  async getDefinition() {
    const { datasource } = this.options

    // Nested providers should already have exposed their own schema
    return {
      schema: datasource?.value?.schema,
      primaryDisplay: datasource?.value?.primaryDisplay,
    }
  }

  async getData() {
    const { datasource } = this.options
    // Pull the rows from the existing data provider
    return {
      rows: datasource?.value?.rows || [],
      hasNextPage: false,
      cursor: null,
    }
  }
}
