import * as postgres from "./postgres"

export const testDatasourceConfig = {
  postgres: postgres.getDatasourceConfig,
}
