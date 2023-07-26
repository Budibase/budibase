import { Row } from "../../../documents/app/row"

export interface DeleteRows {
  rows: (Row | string)[]
}

export interface DeleteRow {
  _id: string
}

export type DeleteRowRequest = DeleteRows | DeleteRow
