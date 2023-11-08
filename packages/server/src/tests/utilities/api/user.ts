import { FetchUserMetadataResponse } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class UserAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  fetch = async (
    { expectStatus } = { expectStatus: 200 }
  ): Promise<FetchUserMetadataResponse> => {
    const res = await this.request
      .get(`/api/users/metadata`)
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

  get = async (
    id: string,
    { expectStatus } = { expectStatus: 200 }
  ): Promise<GetUserMetadataResponse> => {
    const res = await this.request
      .get(`/api/users/metadata/${id}`)
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
}
