import { PatchRowRequest } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class RowAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
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
