import { PatchRowRequest, SaveRowRequest, Row } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class RowAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  get = async (
    sourceId: string,
    rowId: string,
    { expectStatus } = { expectStatus: 200 }
  ) => {
    const request = this.request
      .get(`/api/${sourceId}/rows/${rowId}`)
      .set(this.config.defaultHeaders())
      .expect(expectStatus)
    if (expectStatus !== 404) {
      request.expect("Content-Type", /json/)
    }
    return request
  }

  save = async (
    sourceId: string,
    row: SaveRowRequest,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<Row> => {
    const resp = await this.request
      .post(`/api/${sourceId}/rows`)
      .send(row)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return resp.body as Row
  }

  patch = async (
    sourceId: string,
    row: PatchRowRequest,
    { expectStatus } = { expectStatus: 200 }
  ) => {
    return this.request
      .patch(`/api/${sourceId}/rows`)
      .send(row)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
  }

  delete = async (
    sourceId: string,
    rows: Row[],
    { expectStatus } = { expectStatus: 200 }
  ) => {
    return this.request
      .delete(`/api/${sourceId}/rows`)
      .send({ rows })
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
  }
}
