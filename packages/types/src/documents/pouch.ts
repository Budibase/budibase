export interface RowValue {
  rev: string
  deleted: boolean
}

export interface RowResponse<T> {
  id: string
  key: string
  error: string
  value: T | RowValue
  doc?: T | any
}

export interface AllDocsResponse<T> {
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
