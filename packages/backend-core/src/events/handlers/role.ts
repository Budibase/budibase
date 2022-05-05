import { processEvent } from "../events"
import {
  Event,
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
  processEvent(Event.ROLE_CREATED, properties)
}

export function updated(role: Role) {
  const properties: RoleUpdatedEvent = {}
  processEvent(Event.ROLE_UPDATED, properties)
}

export function deleted(role: Role) {
  const properties: RoleDeletedEvent = {}
  processEvent(Event.ROLE_DELETED, properties)
}

export function assigned(user: User, role: Role) {
  const properties: RoleAssignedEvent = {}
  processEvent(Event.ROLE_ASSIGNED, properties)
}

export function unassigned(user: User, role: Role) {
  const properties: RoleUnassignedEvent = {}
  processEvent(Event.ROLE_UNASSIGNED, properties)
}
