import TestConfiguration from "../TestConfiguration"
import { Query } from "@budibase/types"
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

  execute = async (queryId: string): Promise<{ data: any }> => {
    const res = await this.request
      .post(`/api/v2/queries/${queryId}`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)

    if (res.status !== 200) {
      throw new Error(JSON.stringify(res.body))
    }

    return res.body
  }
}
