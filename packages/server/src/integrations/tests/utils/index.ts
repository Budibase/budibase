import { Datasource } from "@budibase/types"
import * as pg from "./postgres"

export interface DatabasePlusTestProvider {
  getDsConfig(): Promise<Datasource>
}

export const databaseTestProviders = {
  postgres: pg,
}
