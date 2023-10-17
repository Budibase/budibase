import {
  Event,
  UserCreatedEvent,
  UserUpdatedEvent,
  UserDeletedEvent,
  UserPermissionAssignedEvent,
  UserPermissionRemovedEvent,
  GroupCreatedEvent,
  GroupUpdatedEvent,
  GroupDeletedEvent,
  GroupUsersAddedEvent,
  GroupUsersDeletedEvent,
  GroupPermissionsEditedEvent,
} from "@budibase/types"

const getEventProperties: Record<
  string,
  (properties: any) => string | undefined
> = {
  [Event.USER_CREATED]: (properties: UserCreatedEvent) => properties.userId,
  [Event.USER_UPDATED]: (properties: UserUpdatedEvent) => properties.userId,
  [Event.USER_DELETED]: (properties: UserDeletedEvent) => properties.userId,
  [Event.USER_PERMISSION_ADMIN_ASSIGNED]: (
    properties: UserPermissionAssignedEvent
  ) => properties.userId,
  [Event.USER_PERMISSION_ADMIN_REMOVED]: (
    properties: UserPermissionRemovedEvent
  ) => properties.userId,
  [Event.USER_PERMISSION_BUILDER_ASSIGNED]: (
    properties: UserPermissionAssignedEvent
  ) => properties.userId,
  [Event.USER_PERMISSION_BUILDER_REMOVED]: (
    properties: UserPermissionRemovedEvent
  ) => properties.userId,
  [Event.USER_GROUP_CREATED]: (properties: GroupCreatedEvent) =>
    properties.groupId,
  [Event.USER_GROUP_UPDATED]: (properties: GroupUpdatedEvent) =>
    properties.groupId,
  [Event.USER_GROUP_DELETED]: (properties: GroupDeletedEvent) =>
    properties.groupId,
  [Event.USER_GROUP_USERS_ADDED]: (properties: GroupUsersAddedEvent) =>
    properties.groupId,
  [Event.USER_GROUP_USERS_REMOVED]: (properties: GroupUsersDeletedEvent) =>
    properties.groupId,
  [Event.USER_GROUP_PERMISSIONS_EDITED]: (
    properties: GroupPermissionsEditedEvent
  ) => properties.groupId,
}

export function getDocumentId(event: Event, properties: any) {
  const extractor = getEventProperties[event]
  if (!extractor) {
    throw new Error("Event does not have a method of document ID extraction")
  }
  return extractor(properties)
}
