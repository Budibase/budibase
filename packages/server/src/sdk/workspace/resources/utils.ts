import {
  DocumentType,
  INTERNAL_TABLE_SOURCE_ID,
  InternalTable,
  prefixed,
  ResourceType,
  SEPARATOR,
} from "@budibase/types"

const resourceTypeIdPrefixes: Record<ResourceType, string> = {
  [ResourceType.PROJECT]: prefixed(DocumentType.PROJECT),
  [ResourceType.AGENT]: prefixed(DocumentType.AGENT),
  [ResourceType.DATASOURCE]: prefixed(DocumentType.DATASOURCE),
  [ResourceType.TABLE]: prefixed(DocumentType.TABLE),
  [ResourceType.ROW_ACTION]: prefixed(DocumentType.ROW_ACTIONS),
  [ResourceType.QUERY]: prefixed(DocumentType.QUERY),
  [ResourceType.AUTOMATION]: prefixed(DocumentType.AUTOMATION),
  [ResourceType.WORKSPACE_APP]: prefixed(DocumentType.WORKSPACE_APP),
  [ResourceType.SCREEN]: prefixed(DocumentType.SCREEN),
}

export const getResourceType = (id: string): ResourceType | undefined =>
  Object.entries(resourceTypeIdPrefixes).find(([_, idPrefix]) =>
    id.startsWith(idPrefix)
  )?.[0] as ResourceType | undefined

const resourceTypeOrder = new Map(
  Object.values(ResourceType)
    .sort()
    .map((type, index) => [type, index])
)

export const compareResourceTypes = (a: ResourceType, b: ResourceType) =>
  resourceTypeOrder.get(a)! - resourceTypeOrder.get(b)!

export const compareResourceIds = (a: string, b: string) =>
  a < b ? -1 : a > b ? 1 : 0

export const isExternalTableEntityId = (id: string) =>
  id.startsWith(prefixed(DocumentType.DATASOURCE)) &&
  id.includes(`${SEPARATOR}${SEPARATOR}`)

export const isDisallowedProjectAssignmentResourceId = (id: string) =>
  id === INTERNAL_TABLE_SOURCE_ID ||
  id === InternalTable.USER_METADATA ||
  isExternalTableEntityId(id)
