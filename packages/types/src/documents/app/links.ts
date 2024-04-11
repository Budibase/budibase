import { Document } from "../document"

export interface LinkInfo {
  rowId: string
  fieldName: string
  tableId: string
}

export interface LinkDocument extends Document {
  type: string
  tableId: string
  doc1: LinkInfo
  doc2: LinkInfo
}

export interface LinkDocumentValue {
  id: string
  thisId: string
  fieldName: string
}
