import TestConfiguration from "../TestConfiguration"
import {
  Query,
  QueryPreview,
  type ExecuteQueryRequest,
  type ExecuteQueryResponse,
} from "@budibase/types"
import { TestAPI } from "./base"

export class QueryAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  create = async (body: Query): Promise<Query> => {
    const res = await this.request
      .post(`/api/queries`)
      .set(this.config.defaultHeaders())
      .send(body)
      .expect("Content-Type", /json/)

    if (res.status !== 200) {
      throw new Error(JSON.stringify(res.body))
    }

    return res.body as Query
  }

  execute = async (
    queryId: string,
    body?: ExecuteQueryRequest
  ): Promise<ExecuteQueryResponse> => {
    const res = await this.request
      .post(`/api/v2/queries/${queryId}`)
      .set(this.config.defaultHeaders())
      .send(body)
      .expect("Content-Type", /json/)

    if (res.status !== 200) {
      throw new Error(JSON.stringify(res.body))
    }

    return res.body
  }

  previewQuery = async (queryPreview: QueryPreview) => {
    const res = await this.request
      .post(`/api/queries/preview`)
      .send(queryPreview)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)

    if (res.status !== 200) {
      throw new Error(JSON.stringify(res.body))
    }

    return res.body
  }
}
