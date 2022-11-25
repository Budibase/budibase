import { Document } from "../document"

export interface LinkDocument extends Document {
  type: string
  doc1: {
    rowId: string
    fieldName: string
    tableId: string
  }
  doc2: {
    rowId: string
    fieldName: string
    tableId: string
  }
}

export interface LinkDocumentValue {
  id: string
  thisId: string
  fieldName: string
}
