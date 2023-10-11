import {
  CreateViewRequest,
  UpdateViewRequest,
  ViewV2,
  SearchViewRowRequest,
} from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"
import { generator } from "@budibase/backend-core/tests"
import { Response } from "superagent"
import sdk from "../../../sdk"

export class ViewV2API extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  create = async (
    viewData?: Partial<CreateViewRequest>,
    { expectStatus } = { expectStatus: 201 }
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
    const result = await this.request
      .post(`/api/v2/views`)
      .send(view)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return result.body.data as ViewV2
  }

  update = async (
    view: UpdateViewRequest,
    {
      expectStatus,
      handleResponse,
    }: {
      expectStatus: number
      handleResponse?: (response: Response) => void
    } = { expectStatus: 200 }
  ): Promise<ViewV2> => {
    const result = await this.request
      .put(`/api/v2/views/${view.id}`)
      .send(view)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)

    if (handleResponse) {
      handleResponse(result)
    }
    return result.body.data as ViewV2
  }

  delete = async (viewId: string, { expectStatus } = { expectStatus: 204 }) => {
    return this.request
      .delete(`/api/v2/views/${viewId}`)
      .set(this.config.defaultHeaders())
      .expect(expectStatus)
  }

  get = async (viewId: string) => {
    return await this.config.doInContext(this.config.appId, () =>
      sdk.views.get(viewId)
    )
  }

  search = async (
    viewId: string,
    params?: SearchViewRowRequest,
    { expectStatus = 200, usePublicUser = false } = {}
  ) => {
    return this.request
      .post(`/api/v2/views/${viewId}/search`)
      .send(params)
      .set(
        usePublicUser
          ? this.config.publicHeaders()
          : this.config.defaultHeaders()
      )
      .expect("Content-Type", /json/)
      .expect(expectStatus)
  }
}
