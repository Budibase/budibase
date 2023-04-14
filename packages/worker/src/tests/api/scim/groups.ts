import {
  ScimCreateGroupRequest,
  ScimGroupListResponse,
  ScimGroupResponse,
  ScimUpdateRequest,
} from "@budibase/types"
import TestConfiguration from "../../TestConfiguration"
import { RequestSettings, ScimTestAPI } from "./shared"

export class ScimGroupsAPI extends ScimTestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  get = async (
    requestSettings?: Partial<RequestSettings> & {
      params?: {
        startIndex?: number
        pageSize?: number
        filter?: string
        excludedAttributes?: string
      }
    }
  ) => {
    let url = `/api/global/scim/v2/groups?`
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
    if (params?.excludedAttributes) {
      url += `excludedAttributes=${params.excludedAttributes}&`
    }
    const res = await this.call(url, "get", requestSettings)
    return res.body as ScimGroupListResponse
  }

  post = async (
    {
      body,
    }: {
      body: ScimCreateGroupRequest
    },
    requestSettings?: Partial<RequestSettings>
  ) => {
    const res = await this.call(
      `/api/global/scim/v2/groups`,
      "post",
      requestSettings,
      body
    )

    return res.body as ScimGroupResponse
  }

  find = async (
    id: string,
    requestSettings?: Partial<RequestSettings> & { qs?: string }
  ) => {
    const res = await this.call(
      `/api/global/scim/v2/groups/${id}?${requestSettings?.qs}`,
      "get",
      requestSettings
    )
    return res.body as ScimGroupResponse
  }

  delete = async (id: string, requestSettings?: Partial<RequestSettings>) => {
    const res = await this.call(
      `/api/global/scim/v2/groups/${id}`,
      "delete",
      requestSettings
    )
    return res.body as ScimGroupResponse
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
      `/api/global/scim/v2/groups/${id}`,
      "patch",
      requestSettings,
      body
    )

    return res.body as ScimGroupResponse
  }
}
