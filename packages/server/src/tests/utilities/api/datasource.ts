import { CreateDatasourceRequest, Datasource } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class DatasourceAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  create = async (
    config: Datasource,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<Datasource> => {
    const body: CreateDatasourceRequest = {
      datasource: config,
      tablesFilter: [],
    }
    const result = await this.request
      .post(`/api/datasources`)
      .send(body)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectStatus)
    return result.body.datasource as Datasource
  }
}
