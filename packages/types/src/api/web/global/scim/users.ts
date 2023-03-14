export interface ScimUserResponse {
  schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"]
  id: string
  externalId: string
  meta: {
    resourceType: "User"
    created: string
    lastModified: string
  }
  userName: string
  name: {
    formatted: string
    familyName: string
    givenName: string
  }
  active: boolean
  emails: [
    {
      value: string
      type: "work"
      primary: true
    }
  ]
}

export interface ScimListResponse {
  schemas: ["urn:ietf:params:scim:api:messages:2.0:ListResponse"]
  totalResults: number
  Resources: ScimUserResponse[]
  startIndex: number
  itemsPerPage: number
}

export interface ScimUserRequest {
  schemas: [
    "urn:ietf:params:scim:schemas:core:2.0:User",
    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"
  ]
  externalId: string
  userName: string
  active: boolean
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
  name: {
    formatted: string
    familyName: string
    givenName: string
  }
  roles: []
}
