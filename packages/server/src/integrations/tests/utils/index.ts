jest.unmock("pg")

import { Datasource } from "@budibase/types"
import * as pg from "./postgres"

jest.setTimeout(30000)

export interface DatabasePlusTestProvider {
  getDsConfig(): Promise<Datasource>
}

export const databaseTestProviders = {
  postgres: pg,
}
