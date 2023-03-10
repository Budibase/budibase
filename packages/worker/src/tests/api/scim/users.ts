import {
  AccountMetadata,
  ScimListResponse,
  ScimUserRequest,
} from "@budibase/types"
import TestConfiguration from "../../TestConfiguration"
import { TestAPI } from "../base"

export class ScimUsersAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  get = async (expect = 200) => {
    const res = await this.request
      .get(`/api/global/scim/v2/users`)
      .set(this.config.bearerAPIHeaders())
      .expect("Content-Type", /json/)
      .expect(expect)

    return res.body as ScimListResponse
  }

  post = async (
    {
      body,
    }: {
      body: ScimUserRequest
    },
    expect = 200
  ) => {
    const res = await this.request
      .post(`/api/global/scim/v2/users`)
      .send(body)
      .set(this.config.bearerAPIHeaders())
      .expect("Content-Type", /json/)
      .expect(expect)

    return res.body as ScimListResponse
  }
}
