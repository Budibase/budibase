import { Document } from "../"

export interface RowValue {
  rev: string
  deleted: boolean
}

export interface RowResponse<T extends Document | RowValue> {
  id: string
  key: string
  error?: string
  value: T
  doc?: T
}

export interface AllDocsResponse<T extends Document | RowValue> {
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
