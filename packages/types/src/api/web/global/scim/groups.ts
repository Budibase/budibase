import { ScimResource, ScimMeta } from "scim-patch"
import { ScimListResponse } from "./shared"

export interface ScimGroupResponse extends ScimResource {
  schemas: ["urn:ietf:params:scim:schemas:core:2.0:Group"]
  id: string
  externalId: string
  displayName: string
  meta: ScimMeta & {
    resourceType: "Group"
  }
  members?: {
    value: string
  }[]
}

export interface ScimCreateGroupRequest {
  schemas: [
    "urn:ietf:params:scim:schemas:core:2.0:Group",
    "http://schemas.microsoft.com/2006/11/ResourceManagement/ADSCIM/2.0/Group"
  ]
  externalId: string
  displayName: string
  meta: ScimMeta & {
    resourceType: "Group"
  }
}

export interface ScimGroupListResponse
  extends ScimListResponse<ScimGroupResponse> {}
