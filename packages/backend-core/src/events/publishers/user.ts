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

/* eslint-disable */

export function created(user: User) {
  const properties: UserCreatedEvent = {}
  publishEvent(Event.USER_CREATED, properties)
}

export function updated(user: User) {
  const properties: UserUpdatedEvent = {}
  publishEvent(Event.USER_UPDATED, properties)
}

export function deleted(user: User) {
  const properties: UserDeletedEvent = {}
  publishEvent(Event.USER_DELETED, properties)
}

// PERMISSIONS

export function permissionAdminAssigned(user: User) {
  const properties: UserPermissionAssignedEvent = {}
  publishEvent(Event.USER_PERMISSION_ADMIN_ASSIGNED, properties)
}

export function permissionAdminRemoved(user: User) {
  const properties: UserPermissionRemovedEvent = {}
  publishEvent(Event.USER_PERMISSION_ADMIN_REMOVED, properties)
}

export function permissionBuilderAssigned(user: User) {
  const properties: UserPermissionAssignedEvent = {}
  publishEvent(Event.USER_PERMISSION_BUILDER_ASSIGNED, properties)
}

export function permissionBuilderRemoved(user: User) {
  const properties: UserPermissionRemovedEvent = {}
  publishEvent(Event.USER_PERMISSION_BUILDER_REMOVED, properties)
}

// INVITE

export function invited(userInfo: any) {
  const properties: UserInvitedEvent = {}
  publishEvent(Event.USER_INVITED, properties)
}

export function inviteAccepted(user: User) {
  const properties: UserInviteAcceptedEvent = {}
  publishEvent(Event.USER_INVITED_ACCEPTED, properties)
}

// PASSWORD

export function passwordForceReset(user: User) {
  const properties: UserPasswordForceResetEvent = {}
  publishEvent(Event.USER_PASSWORD_FORCE_RESET, properties)
}

export function passwordUpdated(user: User) {
  const properties: UserPasswordUpdatedEvent = {}
  publishEvent(Event.USER_PASSWORD_UPDATED, properties)
}

export function passwordResetRequested(user: User) {
  const properties: UserPasswordResetRequestedEvent = {}
  publishEvent(Event.USER_PASSWORD_RESET_REQUESTED, properties)
}

export function passwordReset(user: User) {
  const properties: UserPasswordResetEvent = {}
  publishEvent(Event.USER_PASSWORD_RESET, properties)
}
