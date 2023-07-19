import { ViewV2 } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"
import { generator } from "@budibase/backend-core/tests"

export class ViewV2API extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  create = async (
    tableId?: string,
    viewData?: Partial<ViewV2>,
    { expectStatus } = { expectStatus: 201 }
  ): Promise<ViewV2> => {
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
      .post(`/api/v2/views/${tableId}`)
      .send(view)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return result.body.data as ViewV2
  }

  delete = async (
    tableId: string,
    viewId: string,
    { expectStatus } = { expectStatus: 204 }
  ) => {
    return this.request
      .delete(`/api/v2/views/${tableId}/${viewId}`)
      .set(this.config.defaultHeaders())
      .expect(expectStatus)
  }

  search = async (viewId: string, { expectStatus } = { expectStatus: 200 }) => {
    return this.request
      .get(`/api/v2/views/${viewId}/search`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
  }
}
