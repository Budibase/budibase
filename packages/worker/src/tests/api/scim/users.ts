import { AccountMetadata, ScimListResponse } from "@budibase/types"
import TestConfiguration from "../../TestConfiguration"
import { TestAPI } from "../base"

export class ScimUsersAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  get = async ({ expect }: { expect: number } = { expect: 200 }) => {
    const res = await this.request
      .get(`/api/global/scim/v2/users`)
      .set(this.config.bearerAPIHeaders())
      .expect("Content-Type", /json/)
      .expect(expect)

    return res.body as ScimListResponse
  }
}
