import {
  ScimUserListResponse,
  ScimCreateUserRequest,
  ScimUserResponse,
  ScimUpdateRequest,
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
    method: "get" | "post" | "patch" | "delete",
    requestSettings?: Partial<RequestSettings>,
    body?: object
  ) => {
    const { expect, setHeaders } = { ...defaultConfig, ...requestSettings }
    let request = this.request[method](url).expect(expect)

    request = request.set(
      "content-type",
      "application/scim+json; charset=utf-8"
    )

    if (method !== "delete") {
      request = request.expect("Content-Type", /json/)
    }

    if (body) {
      request = request.send(body)
    }

    if (setHeaders) {
      request = request.set(this.config.bearerAPIHeaders())
    }
    return request
  }

  get = async (
    requestSettings?: Partial<RequestSettings> & {
      params?: { startIndex?: number; pageSize?: number }
    }
  ) => {
    let url = `/api/global/scim/v2/users?`
    const params = requestSettings?.params
    if (params?.pageSize) {
      url += `count=${params.pageSize}&`
    }
    if (params?.startIndex) {
      url += `startIndex=${params.startIndex}&`
    }
    const res = await this.#createRequest(url, "get", requestSettings)
    return res.body as ScimUserListResponse
  }

  find = async (id: string, requestSettings?: Partial<RequestSettings>) => {
    const res = await this.#createRequest(
      `/api/global/scim/v2/users/${id}`,
      "get",
      requestSettings
    )
    return res.body as ScimUserResponse
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

  patch = async (
    {
      id,
      body,
    }: {
      id: string
      body: ScimUpdateRequest
    },
    requestSettings?: Partial<RequestSettings>
  ) => {
    const res = await this.#createRequest(
      `/api/global/scim/v2/users/${id}`,
      "patch",
      requestSettings,
      body
    )

    return res.body as ScimUserResponse
  }

  delete = async (id: string, requestSettings?: Partial<RequestSettings>) => {
    const res = await this.#createRequest(
      `/api/global/scim/v2/users/${id}`,
      "delete",
      requestSettings
    )
    return res.body as ScimUserResponse
  }
}
