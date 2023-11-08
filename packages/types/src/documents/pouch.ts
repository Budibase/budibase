import { Document } from "../"

export interface RowValue {
  rev: string
  deleted: boolean
}

export interface RowResponse<T extends Document> {
  id: string
  key: string
  error: string
  value: T | RowValue
  doc?: T
}

export interface AllDocsResponse<T extends Document> {
  offset: number
  total_rows: number
  rows: RowResponse<T>[]
}

export type BulkDocsResponse = BulkDocResponse[]

interface BulkDocResponse {
  ok: boolean
  id: string
  rev: string
}

export interface PutResponse {
  ok: boolean
  id: string
  rev: string
}
