import { PatchRowRequest } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class RowAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  get = async (
    tableId: string,
    rowId: string,
    { expectStatus } = { expectStatus: 200 }
  ) => {
    const request = this.request
      .get(`/api/${tableId}/rows/${rowId}`)
      .set(this.config.defaultHeaders())
      .expect(expectStatus)
    if (expectStatus !== 404) {
      request.expect("Content-Type", /json/)
    }
    return request
  }

  patch = async (
    tableId: string,
    row: PatchRowRequest,
    { expectStatus } = { expectStatus: 200 }
  ) => {
    return this.request
      .patch(`/api/${tableId}/rows`)
      .send(row)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
  }
}
