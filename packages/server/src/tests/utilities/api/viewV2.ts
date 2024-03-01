import {
  CreateViewRequest,
  UpdateViewRequest,
  ViewV2,
  SearchViewRowRequest,
  PaginatedSearchRowResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"
import { generator } from "@budibase/backend-core/tests"
import sdk from "../../../sdk"

export class ViewV2API extends TestAPI {
  create = async (
    viewData?: Partial<CreateViewRequest>,
    expectations?: Expectations
  ): Promise<ViewV2> => {
    let tableId = viewData?.tableId
    if (!tableId && !this.config.table) {
      throw "Test requires table to be configured."
    }

    tableId = tableId || this.config.table!._id!
    const view = {
      tableId,
      name: generator.guid(),
      ...viewData,
    }

    const resp = await this._post<{ data: ViewV2 }>("/api/v2/views", {
      body: view,
      expectations,
    })
    return resp.data
  }

  update = async (
    view: UpdateViewRequest,
    expectations?: Expectations
  ): Promise<ViewV2> => {
    const resp = await this._put<{ data: ViewV2 }>(`/api/v2/views/${view.id}`, {
      body: view,
      expectations,
    })
    return resp.data
  }

  delete = async (viewId: string, expectations?: Expectations) => {
    return await this._delete(`/api/v2/views/${viewId}`, { expectations })
  }

  get = async (viewId: string) => {
    return await this.config.doInContext(this.config.appId, () =>
      sdk.views.get(viewId)
    )
  }

  search = async (
    viewId: string,
    params?: SearchViewRowRequest,
    expectations?: Expectations
  ) => {
    return await this._post<PaginatedSearchRowResponse>(
      `/api/v2/views/${viewId}/search`,
      {
        body: params,
        expectations,
      }
    )
  }

  publicSearch = async (
    viewId: string,
    params?: SearchViewRowRequest,
    expectations?: Expectations
  ) => {
    return await this._post<PaginatedSearchRowResponse>(
      `/api/v2/views/${viewId}/search`,
      {
        body: params,
        expectations,
        publicUser: true,
      }
    )
  }
}
