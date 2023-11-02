import { Document } from "../document"

export interface InnerLink {
  rowId: string
  fieldName: string
  tableId: string
}
export interface LinkDocument extends Document {
  type: string
  doc1: InnerLink
  doc2: InnerLink
}

export interface LinkDocumentValue {
  id: string
  thisId: string
  fieldName: string
}
