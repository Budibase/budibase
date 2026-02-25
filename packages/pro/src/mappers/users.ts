import { utils } from "@budibase/backend-core"
import { utils as sharedCoreUtils } from "@budibase/shared-core"
import {
  ScimCreateUserRequest,
  ScimUserResponse,
  User,
  UserStatus,
} from "@budibase/types"
import { Filter, parse } from "scim2-parse-filter"
import { GetUsersFilters } from "../sdk/scim/users"

const { unreachable } = sharedCoreUtils

export const toScimUserResponse = (user: User): ScimUserResponse => {
  const { isSync, roles, ...scimInfo } = user.scimInfo || ({} as any)

  const response = {
    ...scimInfo,
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:User"],
    id: user._id!,
    meta: {
      resourceType: "User",
      created: new Date(user.createdAt!),
      lastModified: new Date(user.updatedAt!),
    },
    active: user.status === UserStatus.ACTIVE,
  } as ScimUserResponse

  if (user.firstName || user.lastName) {
    response.name = {
      formatted: [user.firstName, user.lastName].filter(s => s).join(" "),
      familyName: user.lastName,
      givenName: user.firstName,
    }
  }

  const ENTERPRISE_USER_EXTENSION =
    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"
  if (response[ENTERPRISE_USER_EXTENSION]?.manager) {
    const managerValue = response[ENTERPRISE_USER_EXTENSION].manager
    // AD send the manager field as string (https://learn.microsoft.com/en-us/entra/identity/app-provisioning/use-scim-to-provision-users-and-groups#design-your-user-and-group-schema),
    // but expects the response as RFC-7643 valid response
    if (typeof managerValue === "string") {
      response[ENTERPRISE_USER_EXTENSION].manager = {
        value: managerValue,
      }
    }
  }

  return response
}

const isScimUserResponse = (
  user: ScimUserResponse | ScimCreateUserRequest
): user is ScimUserResponse => {
  return !!(user as ScimUserResponse)?.id
}

function tryGetEmail(
  user: ScimUserResponse | ScimCreateUserRequest
): string | undefined {
  if (utils.validEmail(user.userName)) {
    return user.userName
  }

  if (!user.emails) {
    return undefined
  }

  return user.emails.find(x => x.primary)?.value || user.emails[0]?.value
}

export const fromScimUser = (
  scimUser: ScimUserResponse | ScimCreateUserRequest
): User => {
  const existingUser = isScimUserResponse(scimUser) ? scimUser : undefined

  const email = tryGetEmail(scimUser)
  if (!email) {
    throw new Error("Email is required")
  }

  let isActive
  switch (scimUser.active) {
    case "True":
    case "true":
    case true:
      isActive = true
      break
    case "False":
    case "false":
    case false:
      isActive = false
      break
    default:
      unreachable(scimUser.active)
  }

  let firstName, lastName
  if (scimUser.name?.givenName) {
    firstName = scimUser.name?.givenName
    lastName = scimUser.name?.familyName
  } else {
    firstName = scimUser.displayName
  }

  const u: User = {
    // This is actually not required, but required in the types
    tenantId: "",
    _id: existingUser?.id,
    userId: existingUser?.id,
    email,
    firstName,
    lastName,
    scimInfo: {
      ...scimUser,
      isSync: true,
    },
    roles: {},
    status: isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE,
    createdAt: existingUser?.meta.created.getTime(),
    updatedAt: existingUser?.meta.lastModified.toISOString(),
  }
  return u
}

export const userFilters = (filter: string): GetUsersFilters => {
  const filters: GetUsersFilters = {
    equal: {},
  }

  const parsed = parse(filter)

  function parseFilters(filter: Filter) {
    switch (filter.op) {
      case "eq": {
        const attribute = filter.attrPath
        let attributeToMap
        switch (attribute) {
          case "emails.value":
            attributeToMap = "email"
            break
          default:
            attributeToMap = `scimInfo.${attribute}`
        }

        filters.equal![attributeToMap] = filter.compValue
        break
      }
      case "and":
        for (const f of filter.filters) {
          parseFilters(f)
        }
        break
      default:
        console.warn("Filter not handled", { filter })
    }
  }

  parseFilters(parsed)

  return filters
}
