import { PatchRowRequest } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class RowAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  get = async (tableId: string, rowId: string) => {
    return await this.request
      .get(`/api/${tableId}/rows/${rowId}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
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
