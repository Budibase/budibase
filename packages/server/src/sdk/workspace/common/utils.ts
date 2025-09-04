import { SourceType } from "@budibase/types"
import {
  isDatasourceOrDatasourcePlusId,
  isQueryId,
  isTableIdOrExternalTableId,
  isViewId,
} from "@budibase/shared-core"

export function getSourceType(sourceId: string): SourceType {
  if (isTableIdOrExternalTableId(sourceId)) {
    return SourceType.TABLE
  } else if (isViewId(sourceId)) {
    return SourceType.VIEW
  } else if (isDatasourceOrDatasourcePlusId(sourceId)) {
    return SourceType.DATASOURCE
  } else if (isQueryId(sourceId)) {
    return SourceType.QUERY
  }
  throw new Error(`Unknown source type for source "${sourceId}"`)
}
