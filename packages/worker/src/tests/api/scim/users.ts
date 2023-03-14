import {
  ScimUserListResponse,
  ScimCreateUserRequest,
  ScimUserResponse,
} from "@budibase/types"
import TestConfiguration from "../../TestConfiguration"
import { TestAPI } from "../base"

const defaultConfig = {
  expect: 200,
  setHeaders: true,
}

type RequestSettings = typeof defaultConfig

export class ScimUsersAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  #createRequest = (
    url: string,
    method: "get" | "post",
    requestSettings?: Partial<RequestSettings>,
    body?: object
  ) => {
    const { expect, setHeaders } = { ...defaultConfig, ...requestSettings }
    let request = this.request[method](url)
      .expect("Content-Type", /json/)
      .expect(expect)

    if (body) {
      request = request.send(body)
    }

    if (setHeaders) {
      request = request.set(this.config.bearerAPIHeaders())
    }
    return request
  }

  get = async (requestSettings?: Partial<RequestSettings>) => {
    const res = await this.#createRequest(
      `/api/global/scim/v2/users`,
      "get",
      requestSettings
    )
    return res.body as ScimUserListResponse
  }

  post = async (
    {
      body,
    }: {
      body: ScimCreateUserRequest
    },
    requestSettings?: Partial<RequestSettings>
  ) => {
    const res = await this.#createRequest(
      `/api/global/scim/v2/users`,
      "post",
      requestSettings,
      body
    )

    return res.body as ScimUserResponse
  }
}
