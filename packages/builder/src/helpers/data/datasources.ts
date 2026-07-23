import { BUDIBASE_INTERNAL_DB_ID } from "@/constants/backend"
import type { Datasource, UIInternalDatasource } from "@budibase/types"

export const isAssignableDatasource = (
  datasource: Datasource | UIInternalDatasource
): datasource is Datasource =>
  !!datasource._id &&
  datasource._id !== BUDIBASE_INTERNAL_DB_ID &&
  datasource._id !== "__draft__" &&
  !Array.isArray(datasource.entities)
