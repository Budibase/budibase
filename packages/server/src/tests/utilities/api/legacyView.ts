import { Expectations, TestAPI } from "./base"
import { Row, RowExportFormat, View, ViewCalculation } from "@budibase/types"

export class LegacyViewAPI extends TestAPI {
  get = async (
    id: string,
    query?: { calculation: ViewCalculation; group?: string },
    expectations?: Expectations
  ) => {
    return await this._get<Row[]>(`/api/views/${id}`, { query, expectations })
  }

  save = async (body: View, expectations?: Expectations) => {
    return await this._post<View>(`/api/views/`, { body, expectations })
  }

  fetch = async (expectations?: Expectations) => {
    return await this._get<View[]>(`/api/views`, { expectations })
  }

  destroy = async (id: string, expectations?: Expectations) => {
    return await this._delete<View>(`/api/views/${id}`, { expectations })
  }

  export = async (
    viewName: string,
    format: `${RowExportFormat}`,
    expectations?: Expectations
  ) => {
    const response = await this._requestRaw("get", `/api/views/export`, {
      query: { view: viewName, format },
      expectations,
    })
    return this._checkResponse(response, expectations).text
  }
}
