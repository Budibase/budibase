import { publishEvent } from "../events"
import {
  Event,
  User,
  UserCreatedEvent,
  UserDeletedEvent,
  UserInviteAcceptedEvent,
  UserInvitedEvent,
  UserPasswordForceResetEvent,
  UserPasswordResetEvent,
  UserPasswordResetRequestedEvent,
  UserPasswordUpdatedEvent,
  UserPermissionAssignedEvent,
  UserPermissionRemovedEvent,
  UserUpdatedEvent,
} from "@budibase/types"

export async function created(user: User, timestamp?: number) {
  const properties: UserCreatedEvent = {
    userId: user._id as string,
  }
  await publishEvent(Event.USER_CREATED, properties, timestamp)
}

export async function updated(user: User) {
  const properties: UserUpdatedEvent = {
    userId: user._id as string,
  }
  await publishEvent(Event.USER_UPDATED, properties)
}

export async function deleted(user: User) {
  const properties: UserDeletedEvent = {
    userId: user._id as string,
  }
  await publishEvent(Event.USER_DELETED, properties)
}

// PERMISSIONS

export async function permissionAdminAssigned(user: User, timestamp?: number) {
  const properties: UserPermissionAssignedEvent = {
    userId: user._id as string,
  }
  await publishEvent(
    Event.USER_PERMISSION_ADMIN_ASSIGNED,
    properties,
    timestamp
  )
}

export async function permissionAdminRemoved(user: User) {
  const properties: UserPermissionRemovedEvent = {
    userId: user._id as string,
  }
  await publishEvent(Event.USER_PERMISSION_ADMIN_REMOVED, properties)
}

export async function permissionBuilderAssigned(
  user: User,
  timestamp?: number
) {
  const properties: UserPermissionAssignedEvent = {
    userId: user._id as string,
  }
  await publishEvent(
    Event.USER_PERMISSION_BUILDER_ASSIGNED,
    properties,
    timestamp
  )
}

export async function permissionBuilderRemoved(user: User) {
  const properties: UserPermissionRemovedEvent = {
    userId: user._id as string,
  }
  await publishEvent(Event.USER_PERMISSION_BUILDER_REMOVED, properties)
}

// INVITE

export async function invited() {
  const properties: UserInvitedEvent = {}
  await publishEvent(Event.USER_INVITED, properties)
}

export async function inviteAccepted(user: User) {
  const properties: UserInviteAcceptedEvent = {
    userId: user._id as string,
  }
  await publishEvent(Event.USER_INVITED_ACCEPTED, properties)
}

// PASSWORD

export async function passwordForceReset(user: User) {
  const properties: UserPasswordForceResetEvent = {
    userId: user._id as string,
  }
  await publishEvent(Event.USER_PASSWORD_FORCE_RESET, properties)
}

export async function passwordUpdated(user: User) {
  const properties: UserPasswordUpdatedEvent = {
    userId: user._id as string,
  }
  await publishEvent(Event.USER_PASSWORD_UPDATED, properties)
}

export async function passwordResetRequested(user: User) {
  const properties: UserPasswordResetRequestedEvent = {
    userId: user._id as string,
  }
  await publishEvent(Event.USER_PASSWORD_RESET_REQUESTED, properties)
}

export async function passwordReset(user: User) {
  const properties: UserPasswordResetEvent = {
    userId: user._id as string,
  }
  await publishEvent(Event.USER_PASSWORD_RESET, properties)
}
