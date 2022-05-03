import { processEvent } from "../events"
import {
  Events,
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
  processEvent(Events.USER_CREATED, properties)
}

export function updated(user: User) {
  const properties: UserUpdatedEvent = {}
  processEvent(Events.USER_UPDATED, properties)
}

export function deleted(user: User) {
  const properties: UserDeletedEvent = {}
  processEvent(Events.USER_DELETED, properties)
}

// PERMISSIONS

export function permissionAdminAssigned(user: User) {
  const properties: UserPermissionAssignedEvent = {}
  processEvent(Events.USER_PERMISSION_ADMIN_ASSIGNED, properties)
}

export function permissionAdminRemoved(user: User) {
  const properties: UserPermissionRemovedEvent = {}
  processEvent(Events.USER_PERMISSION_ADMIN_REMOVED, properties)
}

export function permissionBuilderAssigned(user: User) {
  const properties: UserPermissionAssignedEvent = {}
  processEvent(Events.USER_PERMISSION_BUILDER_ASSIGNED, properties)
}

export function permissionBuilderRemoved(user: User) {
  const properties: UserPermissionRemovedEvent = {}
  processEvent(Events.USER_PERMISSION_BUILDER_REMOVED, properties)
}

// INVITE

export function invited(userInfo: any) {
  const properties: UserInvitedEvent = {}
  processEvent(Events.USER_INVITED, properties)
}

export function inviteAccepted(user: User) {
  const properties: UserInviteAcceptedEvent = {}
  processEvent(Events.USER_INVITED_ACCEPTED, properties)
}

// PASSWORD

export function passwordForceReset(user: User) {
  const properties: UserPasswordForceResetEvent = {}
  processEvent(Events.USER_PASSWORD_FORCE_RESET, properties)
}

export function passwordUpdated(user: User) {
  const properties: UserPasswordUpdatedEvent = {}
  processEvent(Events.USER_PASSWORD_UPDATED, properties)
}

export function passwordResetRequested(user: User) {
  const properties: UserPasswordResetRequestedEvent = {}
  processEvent(Events.USER_PASSWORD_RESET_REQUESTED, properties)
}

export function passwordReset(user: User) {
  const properties: UserPasswordResetEvent = {}
  processEvent(Events.USER_PASSWORD_RESET, properties)
}
