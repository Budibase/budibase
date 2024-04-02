import { ScimCreateGroupRequest, ScimCreateUserRequest } from "@budibase/types"
import { uuid } from "./common"
import { generator } from "./generator"

interface CreateUserRequestFields {
  externalId: string
  email: string
  firstName: string
  lastName: string
  username: string
}

export function createUserRequest(userData?: Partial<CreateUserRequestFields>) {
  const defaultValues = {
    externalId: uuid(),
    email: `${uuid()}@example.com`,
    firstName: generator.first(),
    lastName: generator.last(),
    username: generator.name(),
  }

  const { externalId, email, firstName, lastName, username } = {
    ...defaultValues,
    ...userData,
  }

  let user: ScimCreateUserRequest = {
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
    roles: [],
  }

  if (firstName || lastName) {
    user.name = {
      formatted: [firstName, lastName].filter(s => s).join(" "),
      familyName: lastName,
      givenName: firstName,
    }
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
      created: new Date(),
      lastModified: new Date(),
    },
  }
  return group
}
