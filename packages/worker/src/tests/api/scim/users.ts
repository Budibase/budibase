import {
  ScimUserListResponse,
  ScimCreateUserRequest,
  ScimUserResponse,
  ScimUpdateRequest,
} from "@budibase/types"
import TestConfiguration from "../../TestConfiguration"
import { RequestSettings, ScimTestAPI } from "./shared"

export class ScimUsersAPI extends ScimTestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  get = async (
    requestSettings?: Partial<RequestSettings> & {
      params?: {
        startIndex?: number
        pageSize?: number
        filter?: string
      }
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
    if (params?.filter) {
      url += `filter=${params.filter}&`
    }
    const res = await this.call(url, "get", requestSettings)
    return res.body as ScimUserListResponse
  }

  find = async (id: string, requestSettings?: Partial<RequestSettings>) => {
    const res = await this.call(
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
    const res = await this.call(
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
    const res = await this.call(
      `/api/global/scim/v2/users/${id}`,
      "patch",
      requestSettings,
      body
    )

    return res.body as ScimUserResponse
  }

  delete = async (id: string, requestSettings?: Partial<RequestSettings>) => {
    const res = await this.call(
      `/api/global/scim/v2/users/${id}`,
      "delete",
      requestSettings
    )
    return res.body as ScimUserResponse
  }
}
