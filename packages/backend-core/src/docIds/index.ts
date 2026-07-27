import { DocumentType, prefixed } from "@budibase/types"

export * from "./ids"
export * from "./params"

export function isType(id: string, type: DocumentType) {
  return (
    Object.values(DocumentType)
      .sort((a, b) => b.length - a.length)
      .find(docType => id.startsWith(prefixed(docType))) === type
  )
}
