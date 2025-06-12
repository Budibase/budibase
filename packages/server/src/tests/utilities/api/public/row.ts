import { Row, SearchRowRequest } from "@budibase/types"
import { Expectations, PublicAPI } from "../base"

export interface PublicSearchResponse {
  data: Row[]
  bookmark?: string | number
  hasNextPage?: boolean
}

export class RowPublicAPI extends PublicAPI {
  search = async (
    tableId: string,
    query?: SearchRowRequest,
    expectations?: Expectations
  ): Promise<PublicSearchResponse> => {
    return await this._post<PublicSearchResponse>(
      `/tables/${tableId}/rows/search`,
      {
        body: query,
        expectations,
      }
    )
  }

  create = async (
    tableId: string,
    row: Row,
    expectations?: Expectations
  ): Promise<Row> => {
    const response = await this._post<{ data: Row }>(
      `/tables/${tableId}/rows`,
      {
        body: row,
        expectations,
      }
    )
    return response.data
  }
}
