import { SaveTableRequest, SaveTableResponse, Table } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class TableAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  create = async (
    data: SaveTableRequest,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<SaveTableResponse> => {
    const res = await this.request
      .post(`/api/tables`)
      .send(data)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return res.body
  }

  fetch = async (
    { expectStatus } = { expectStatus: 200 }
  ): Promise<Table[]> => {
    const res = await this.request
      .get(`/api/tables`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return res.body
  }

  get = async (
    tableId: string,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<Table> => {
    const res = await this.request
      .get(`/api/tables/${tableId}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return res.body
  }
}
