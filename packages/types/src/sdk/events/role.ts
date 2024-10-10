import { BaseEvent } from "./event"

export interface RoleCreatedEvent extends BaseEvent {
  roleId: string
  permissionId: string
  inherits?: string | string[]
}

export interface RoleUpdatedEvent extends BaseEvent {
  roleId: string
  permissionId: string
  inherits?: string | string[]
}

export interface RoleDeletedEvent extends BaseEvent {
  roleId: string
  permissionId: string
  inherits?: string | string[]
}

export interface RoleAssignedEvent extends BaseEvent {
  userId: string
  roleId: string
}

export interface RoleUnassignedEvent extends BaseEvent {
  userId: string
  roleId: string
}
