import { processEvent } from "../events"
import {
  Events,
  Role,
  RoleAssignedEvent,
  RoleCreatedEvent,
  RoleDeletedEvent,
  RoleUnassignedEvent,
  RoleUpdatedEvent,
  User,
} from "@budibase/types"

/* eslint-disable */

export function created(role: Role) {
  const properties: RoleCreatedEvent = {}
  processEvent(Events.ROLE_CREATED, properties)
}

export function updated(role: Role) {
  const properties: RoleUpdatedEvent = {}
  processEvent(Events.ROLE_UPDATED, properties)
}

export function deleted(role: Role) {
  const properties: RoleDeletedEvent = {}
  processEvent(Events.ROLE_DELETED, properties)
}

export function assigned(user: User, role: Role) {
  const properties: RoleAssignedEvent = {}
  processEvent(Events.ROLE_ASSIGNED, properties)
}

export function unassigned(user: User, role: Role) {
  const properties: RoleUnassignedEvent = {}
  processEvent(Events.ROLE_UNASSIGNED, properties)
}
