import { SEPARATOR, DocumentType, VirtualDocumentType } from "@budibase/types"

// Because DocumentTypes can overlap, we need to make sure that we search
// longest first to ensure we get the correct type.
const sortedDocumentTypes = Object.values(DocumentType).sort(
  (a, b) => b.length - a.length // descending
)

export function getDocumentType(id: string): DocumentType | undefined {
  return sortedDocumentTypes.find(docType =>
    id.startsWith(`${docType}${SEPARATOR}`)
  )
}

// Because VirtualDocumentTypes can overlap, we need to make sure that we search
// longest first to ensure we get the correct type.
const sortedVirtualDocumentTypes = Object.values(VirtualDocumentType).sort(
  (a, b) => b.length - a.length // descending
)
export function getVirtualDocumentType(
  id: string
): VirtualDocumentType | undefined {
  return sortedVirtualDocumentTypes.find(docType =>
    id.startsWith(`${docType}${SEPARATOR}`)
  )
}

const EXTERNAL_TABLE_ID_REGEX = new RegExp(
  `^${DocumentType.DATASOURCE_PLUS}_(.+)__(.+)$`
)

const idCheckFor = (
  type: DocumentType | VirtualDocumentType
): ((id: string) => boolean) => {
  return (id: string): boolean => !!id && id.startsWith(`${type}${SEPARATOR}`)
}

export const isExternalTableId = (id: string): boolean => {
  const matches = id.match(EXTERNAL_TABLE_ID_REGEX)
  return !!id && matches !== null
}

/**
 *  This function checks if the given ID is a table ID, including datasource
 *  plus tables.
 *
 *  Example of IDs that will return true:
 *  - "ta_12345"
 *  - "datasource_plus_12345__ta_67890"
 */
export const isTableIdOrExternalTableId = (id: string): boolean => {
  return isTableId(id) || isExternalTableId(id)
}

export const isTableId = idCheckFor(DocumentType.TABLE)
export const isViewId = idCheckFor(VirtualDocumentType.VIEW)

export const isDatasourceOrDatasourcePlusId = idCheckFor(
  DocumentType.DATASOURCE
)

export const isQueryId = idCheckFor(DocumentType.QUERY)

export function getTableIdFromViewId(viewId: string) {
  if (!isViewId(viewId)) {
    throw new Error("Unable to extract table ID, is not a view ID")
  }
  const split = viewId.split(SEPARATOR)
  split.shift()
  viewId = split.join(SEPARATOR)
  const regex = new RegExp(`^(?<tableId>.+)${SEPARATOR}([^${SEPARATOR}]+)$`)
  const res = regex.exec(viewId)
  return res!.groups!["tableId"]
}
