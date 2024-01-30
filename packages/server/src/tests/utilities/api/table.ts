import {
  MigrateRequest,
  MigrateResponse,
  SaveTableRequest,
  SaveTableResponse,
  Table,
} from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class TableAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  save = async (
    data: SaveTableRequest,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<SaveTableResponse> => {
    const res = await this.request
      .post(`/api/tables`)
      .send(data)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)

    if (res.status !== expectStatus) {
      throw new Error(
        `Expected status ${expectStatus} but got ${
          res.status
        } with body ${JSON.stringify(res.body)}`
      )
    }

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

  migrate = async (
    tableId: string,
    data: MigrateRequest,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<MigrateResponse> => {
    const res = await this.request
      .post(`/api/tables/${tableId}/migrate`)
      .send(data)
      .set(this.config.defaultHeaders())
    if (res.status !== expectStatus) {
      throw new Error(
        `Expected status ${expectStatus} but got ${
          res.status
        } with body ${JSON.stringify(res.body)}`
      )
    }
    return res.body
  }
}
