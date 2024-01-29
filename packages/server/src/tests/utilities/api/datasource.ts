import {
  CreateDatasourceRequest,
  Datasource,
  VerifyDatasourceRequest,
} from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"
import supertest from "supertest"

export class DatasourceAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  create = async <B extends boolean>(
    config: Datasource,
    {
      expectStatus,
      rawResponse,
    }: { expectStatus?: number; rawResponse?: B } = {}
  ): Promise<B extends false ? Datasource : supertest.Response> => {
    const body: CreateDatasourceRequest = {
      datasource: config,
      tablesFilter: [],
    }
    const result = await this.request
      .post(`/api/datasources`)
      .send(body)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus || 200)
    if (rawResponse) {
      return result as any
    }
    return result.body.datasource
  }

  update = async (
    datasource: Datasource,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<Datasource> => {
    const result = await this.request
      .put(`/api/datasources/${datasource._id}`)
      .send(datasource)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return result.body.datasource as Datasource
  }

  verify = async (
    data: VerifyDatasourceRequest,
    { expectStatus } = { expectStatus: 200 }
  ) => {
    const result = await this.request
      .post(`/api/datasources/verify`)
      .send(data)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return result
  }
}
