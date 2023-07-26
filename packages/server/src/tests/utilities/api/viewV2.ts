import { CreateViewRequest, SortOrder, SortType, ViewV2 } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"
import { generator } from "@budibase/backend-core/tests"
import { Response } from "superagent"

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
    view: ViewV2,
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

  search = async (
    viewId: string,
    options?: {
      sort: {
        column: string
        order?: SortOrder
        type?: SortType
      }
    },
    { expectStatus } = { expectStatus: 200 }
  ) => {
    const qs: [string, any][] = []
    if (options?.sort.column) {
      qs.push(["sort_column", options.sort.column])
    }
    if (options?.sort.order) {
      qs.push(["sort_order", options.sort.order])
    }
    if (options?.sort.type) {
      qs.push(["sort_type", options.sort.type])
    }
    let url = `/api/v2/views/${viewId}/search`
    if (qs.length) {
      url += "?" + qs.map(q => q.join("=")).join("&")
    }
    return this.request
      .get(url)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
  }
}
