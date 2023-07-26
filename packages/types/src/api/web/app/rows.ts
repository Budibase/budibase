import { Row } from "../../../documents"

export interface PatchRowRequest extends Row {}

export interface PatchRowResponse extends Row {}

export interface SearchResponse {
  rows: any[]
}
