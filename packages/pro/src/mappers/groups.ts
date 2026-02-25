import {
  ScimCreateGroupRequest,
  ScimGroupResponse,
  UserGroup,
} from "@budibase/types"

export const toScimGroupResponse = (group: UserGroup): ScimGroupResponse => {
  return {
    schemas: ["urn:ietf:params:scim:schemas:core:2.0:Group"],
    id: group._id!,
    externalId: group.scimInfo!.externalId,
    meta: {
      resourceType: "Group",
      created: new Date(group.createdAt!),
      lastModified: new Date(group.updatedAt!),
    },
    displayName: group.name,
    members: group.users?.map(u => ({ value: u._id })),
  }
}

const isScimGroup = (
  group: ScimGroupResponse | ScimCreateGroupRequest
): group is ScimGroupResponse => {
  return !!(group as ScimGroupResponse)?.id
}

export const fromScimGroup = (
  group: ScimGroupResponse | ScimCreateGroupRequest
): UserGroup => {
  const existingGroup = isScimGroup(group) ? group : undefined

  const g: UserGroup = {
    _id: existingGroup?.id,
    name: group.displayName,
    scimInfo: {
      externalId: group.externalId,
      isSync: true,
    },
    icon: "UserGroup",
    color: "var(--spectrum-global-color-blue-600)",
    createdAt: existingGroup?.meta.created.getTime(),
    updatedAt: existingGroup?.meta.lastModified.toISOString(),
  }
  return g
}
