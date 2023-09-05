import { Datasource } from "@budibase/types"
export * from "./postgres"

export interface DatabasePlusTestProvider {
  getDsConfig(): Datasource
}
