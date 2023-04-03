import { ScimResource, ScimMeta, ScimPatchOperation } from "scim-patch"
import { ScimListResponse } from "./shared"

type BooleanString = boolean | "True" | "true" | "False" | "false"

export interface ScimUserResponse extends ScimResource {
  schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"]
  id: string
  externalId: string
  meta: ScimMeta & {
    resourceType: "User"
  }
  userName: string
  displayName?: string
  name: {
    formatted: string
    familyName: string
    givenName: string
  }
  active: BooleanString
  emails: [
    {
      value: string
      type: "work"
      primary: true
    }
  ]
}

export interface ScimCreateUserRequest {
  schemas: [
    "urn:ietf:params:scim:schemas:core:2.0:User",
    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"
  ]
  externalId: string
  userName: string
  active: BooleanString
  emails: [
    {
      primary: true
      type: "work"
      value: string
    }
  ]
  meta: {
    resourceType: "User"
  }
  displayName?: string
  name: {
    formatted: string
    familyName: string
    givenName: string
  }
  roles: []
}

export interface ScimUserListResponse
  extends ScimListResponse<ScimUserResponse> {}
