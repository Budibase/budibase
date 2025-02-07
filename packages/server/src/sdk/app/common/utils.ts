import { SourceType } from "@budibase/types"
import { docIds } from "@budibase/backend-core"

export function getSourceType(sourceId: string): SourceType {
  if (docIds.isTableId(sourceId)) {
    return SourceType.TABLE
  } else if (docIds.isViewId(sourceId)) {
    return SourceType.VIEW
  } else if (docIds.isDatasourceId(sourceId)) {
    return SourceType.DATASOURCE
  } else if (docIds.isQueryId(sourceId)) {
    return SourceType.QUERY
  }
  throw new Error(`Unknown source type for source "${sourceId}"`)
}
