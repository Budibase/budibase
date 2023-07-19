import { ViewV2 } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"
import { generator } from "@budibase/backend-core/tests"
import supertest from "supertest"

export class ViewV2API extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  create = async (viewData?: Partial<ViewV2>) => {
    if (!this.config.table) {
      throw "Test requires table to be configured."
    }
    const view = {
      tableId: this.config.table._id,
      name: generator.guid(),
      ...viewData,
    }
    const result = await this.request
      .post(`/api/v2/views`)
      .send(view)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(201)
    return result.body.data as ViewV2
  }
  get = (viewId: string): supertest.Test => {
    return this.request
      .get(`/api/v2/views/${viewId}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
  }
}
