import { publishEvent } from "../events"
import {
  Event,
  UserGroup,
  GroupCreatedEvent,
  GroupDeletedEvent,
  GroupUpdatedEvent,
  GroupUsersAddedEvent,
  GroupUsersDeletedEvent,
  GroupAddedOnboardingEvent,
  UserGroupRoles,
} from "@budibase/types"

export async function created(group: UserGroup, timestamp?: number) {
  const properties: GroupCreatedEvent = {
    groupId: group._id as string,
  }
  await publishEvent(Event.USER_GROUP_CREATED, properties, timestamp)
}

export async function updated(group: UserGroup) {
  const properties: GroupUpdatedEvent = {
    groupId: group._id as string,
  }
  await publishEvent(Event.USER_GROUP_UPDATED, properties)
}

export async function deleted(group: UserGroup) {
  const properties: GroupDeletedEvent = {
    groupId: group._id as string,
  }
  await publishEvent(Event.USER_GROUP_DELETED, properties)
}

export async function usersAdded(count: number, group: UserGroup) {
  const properties: GroupUsersAddedEvent = {
    count,
    groupId: group._id as string,
  }
  await publishEvent(Event.USER_GROUP_USERS_ADDED, properties)
}

export async function usersDeleted(emails: string[], group: UserGroup) {
  const properties: GroupUsersDeletedEvent = {
    count: emails.length,
    groupId: group._id as string,
  }
  await publishEvent(Event.USER_GROUP_USERS_REMOVED, properties)
}

export async function createdOnboarding(groupId: string) {
  const properties: GroupAddedOnboardingEvent = {
    groupId: groupId,
    onboarding: true,
  }
  await publishEvent(Event.USER_GROUP_ONBOARDING, properties)
}

export async function permissionsEdited(roles: UserGroupRoles) {
  const properties: UserGroupRoles = {
    ...roles,
  }
  await publishEvent(Event.USER_GROUP_PERMISSIONS_EDITED, properties)
}
