import { processEvent } from "../events"
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
  processEvent(Event.USER_CREATED, properties)
}

export function updated(user: User) {
  const properties: UserUpdatedEvent = {}
  processEvent(Event.USER_UPDATED, properties)
}

export function deleted(user: User) {
  const properties: UserDeletedEvent = {}
  processEvent(Event.USER_DELETED, properties)
}

// PERMISSIONS

export function permissionAdminAssigned(user: User) {
  const properties: UserPermissionAssignedEvent = {}
  processEvent(Event.USER_PERMISSION_ADMIN_ASSIGNED, properties)
}

export function permissionAdminRemoved(user: User) {
  const properties: UserPermissionRemovedEvent = {}
  processEvent(Event.USER_PERMISSION_ADMIN_REMOVED, properties)
}

export function permissionBuilderAssigned(user: User) {
  const properties: UserPermissionAssignedEvent = {}
  processEvent(Event.USER_PERMISSION_BUILDER_ASSIGNED, properties)
}

export function permissionBuilderRemoved(user: User) {
  const properties: UserPermissionRemovedEvent = {}
  processEvent(Event.USER_PERMISSION_BUILDER_REMOVED, properties)
}

// INVITE

export function invited(userInfo: any) {
  const properties: UserInvitedEvent = {}
  processEvent(Event.USER_INVITED, properties)
}

export function inviteAccepted(user: User) {
  const properties: UserInviteAcceptedEvent = {}
  processEvent(Event.USER_INVITED_ACCEPTED, properties)
}

// PASSWORD

export function passwordForceReset(user: User) {
  const properties: UserPasswordForceResetEvent = {}
  processEvent(Event.USER_PASSWORD_FORCE_RESET, properties)
}

export function passwordUpdated(user: User) {
  const properties: UserPasswordUpdatedEvent = {}
  processEvent(Event.USER_PASSWORD_UPDATED, properties)
}

export function passwordResetRequested(user: User) {
  const properties: UserPasswordResetRequestedEvent = {}
  processEvent(Event.USER_PASSWORD_RESET_REQUESTED, properties)
}

export function passwordReset(user: User) {
  const properties: UserPasswordResetEvent = {}
  processEvent(Event.USER_PASSWORD_RESET, properties)
}
