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
  GroupPermissionsEditedEvent,
} from "@budibase/types"
import { isScim } from "../../context"

async function created(group: UserGroup, timestamp?: number) {
  const properties: GroupCreatedEvent = {
    groupId: group._id as string,
    viaScim: isScim(),
    audited: {
      name: group.name,
    },
  }
  await publishEvent(Event.USER_GROUP_CREATED, properties, timestamp)
}

async function updated(group: UserGroup) {
  const properties: GroupUpdatedEvent = {
    groupId: group._id as string,
    viaScim: isScim(),
    audited: {
      name: group.name,
    },
  }
  await publishEvent(Event.USER_GROUP_UPDATED, properties)
}

async function deleted(group: UserGroup) {
  const properties: GroupDeletedEvent = {
    groupId: group._id as string,
    viaScim: isScim(),
    audited: {
      name: group.name,
    },
  }
  await publishEvent(Event.USER_GROUP_DELETED, properties)
}

async function usersAdded(count: number, group: UserGroup) {
  const properties: GroupUsersAddedEvent = {
    count,
    groupId: group._id as string,
    viaScim: isScim(),
    audited: {
      name: group.name,
    },
  }
  await publishEvent(Event.USER_GROUP_USERS_ADDED, properties)
}

async function usersDeleted(count: number, group: UserGroup) {
  const properties: GroupUsersDeletedEvent = {
    count,
    groupId: group._id as string,
    viaScim: isScim(),
    audited: {
      name: group.name,
    },
  }
  await publishEvent(Event.USER_GROUP_USERS_REMOVED, properties)
}

async function createdOnboarding(groupId: string) {
  const properties: GroupAddedOnboardingEvent = {
    groupId: groupId,
    onboarding: true,
  }
  await publishEvent(Event.USER_GROUP_ONBOARDING, properties)
}

async function permissionsEdited(group: UserGroup) {
  const properties: GroupPermissionsEditedEvent = {
    permissions: group.roles!,
    groupId: group._id as string,
    audited: {
      name: group.name,
    },
  }
  await publishEvent(Event.USER_GROUP_PERMISSIONS_EDITED, properties)
}

export default {
  created,
  updated,
  deleted,
  usersAdded,
  usersDeleted,
  createdOnboarding,
  permissionsEdited,
}
