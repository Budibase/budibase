export interface RowResponse<T> {
  id: string
  key: string
  value: any
  doc: T
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
