import { NestedProviderDatasource, TableSchema } from "@budibase/types"
import BaseDataFetch from "./DataFetch"

interface NestedProviderDefinition {
  schema?: TableSchema
  primaryDisplay?: string
}
export default class NestedProviderFetch extends BaseDataFetch<
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
