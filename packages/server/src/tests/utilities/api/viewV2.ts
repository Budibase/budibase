import {
  CreateViewRequest,
  UpdateViewRequest,
  DeleteRowRequest,
  PatchRowRequest,
  PatchRowResponse,
  Row,
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
    tableId = this.config.table!._id!
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
    { expectStatus } = { expectStatus: 200 }
  ) => {
    return this.request
      .post(`/api/v2/views/${viewId}/search`)
      .send(params)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
  }

  row = {
    create: async (
      viewId: string,
      row: Row,
      { expectStatus } = { expectStatus: 200 }
    ): Promise<Row> => {
      const result = await this.request
        .post(`/api/v2/views/${viewId}/rows`)
        .send(row)
        .set(this.config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(expectStatus)
      return result.body as Row
    },
    update: async (
      viewId: string,
      rowId: string,
      row: PatchRowRequest,
      { expectStatus } = { expectStatus: 200 }
    ): Promise<PatchRowResponse> => {
      const result = await this.request
        .patch(`/api/v2/views/${viewId}/rows/${rowId}`)
        .send(row)
        .set(this.config.defaultHeaders())
        .expect("Content-Type", /json/)
        .expect(expectStatus)
      return result.body as PatchRowResponse
    },
    delete: async (
      viewId: string,
      body: DeleteRowRequest,
      { expectStatus } = { expectStatus: 200 }
    ): Promise<any> => {
      const result = await this.request
        .delete(`/api/v2/views/${viewId}/rows`)
        .send(body)
        .set(this.config.defaultHeaders())
        .expect(expectStatus)
      return result.body
    },
  }
}
