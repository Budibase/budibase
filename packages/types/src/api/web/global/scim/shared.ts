import { ScimPatchOperation } from "scim-patch"

export interface ScimListResponse<T> {
  schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"]
  totalResults: number
  Resources: T[]
  startIndex: number
  itemsPerPage: number
}

export interface ScimUpdateRequest {
  schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
  Operations: ScimPatchOperation[]
}
