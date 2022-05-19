import { publishEvent } from "../events"
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
  publishEvent(Event.ROLE_CREATED, properties)
}

export function updated(role: Role) {
  const properties: RoleUpdatedEvent = {}
  publishEvent(Event.ROLE_UPDATED, properties)
}

export function deleted(role: Role) {
  const properties: RoleDeletedEvent = {}
  publishEvent(Event.ROLE_DELETED, properties)
}

export function assigned(user: User, role: string) {
  const properties: RoleAssignedEvent = {}
  publishEvent(Event.ROLE_ASSIGNED, properties)
}

export function unassigned(user: User, role: string) {
  const properties: RoleUnassignedEvent = {}
  publishEvent(Event.ROLE_UNASSIGNED, properties)
}
