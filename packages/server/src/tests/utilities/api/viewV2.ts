import {
  CreateViewRequest,
  UpdateViewRequest,
  ViewV2,
  SearchViewRowRequest,
  PaginatedSearchRowResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"
import sdk from "../../../sdk"

export class ViewV2API extends TestAPI {
  create = async (
    view: CreateViewRequest,
    expectations?: Expectations
  ): Promise<ViewV2> => {
    const exp: Expectations = {
      status: 201,
      ...expectations,
    }

    const resp = await this._post<{ data: ViewV2 }>("/api/v2/views", {
      body: view,
      expectations: exp,
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
    const exp = {
      status: 204,
      ...expectations,
    }
    return await this._delete(`/api/v2/views/${viewId}`, { expectations: exp })
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
