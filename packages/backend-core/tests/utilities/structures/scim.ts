import { ScimCreateGroupRequest, ScimCreateUserRequest } from "@budibase/types"
import { uuid } from "./common"
import { generator } from "./generator"

export function createUserRequest(userData?: {
  externalId?: string
  email?: string
  firstName?: string
  lastName?: string
  username?: string
}) {
  const {
    externalId = uuid(),
    email = generator.email(),
    firstName = generator.first(),
    lastName = generator.last(),
    username = generator.name(),
  } = userData || {}

  const user: ScimCreateUserRequest = {
    schemas: [
      "urn:ietf:params:scim:schemas:core:2.0:User",
      "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User",
    ],
    externalId,
    userName: username,
    active: true,
    emails: [
      {
        primary: true,
        type: "work",
        value: email,
      },
    ],
    meta: {
      resourceType: "User",
    },
    name: {
      formatted: generator.name(),
      familyName: lastName,
      givenName: firstName,
    },
    roles: [],
  }
  return user
}

export function createGroupRequest(groupData?: {
  externalId?: string
  displayName?: string
}) {
  const { externalId = uuid(), displayName = generator.word() } =
    groupData || {}

  const group: ScimCreateGroupRequest = {
    schemas: [
      "urn:ietf:params:scim:schemas:core:2.0:Group",
      "http://schemas.microsoft.com/2006/11/ResourceManagement/ADSCIM/2.0/Group",
    ],
    externalId: externalId,
    displayName: displayName,
    meta: {
      resourceType: "Group",
    },
  }
  return group
}
