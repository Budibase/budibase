export interface ScimUser {
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
  Resources: ScimUser[]
  startIndex: number
  itemsPerPage: number
}
