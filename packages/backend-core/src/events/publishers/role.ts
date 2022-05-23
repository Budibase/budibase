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

export async function created(role: Role) {
  const properties: RoleCreatedEvent = {}
  await publishEvent(Event.ROLE_CREATED, properties)
}

export async function updated(role: Role) {
  const properties: RoleUpdatedEvent = {}
  await publishEvent(Event.ROLE_UPDATED, properties)
}

export async function deleted(role: Role) {
  const properties: RoleDeletedEvent = {}
  await publishEvent(Event.ROLE_DELETED, properties)
}

export async function assigned(user: User, role: string) {
  const properties: RoleAssignedEvent = {}
  await publishEvent(Event.ROLE_ASSIGNED, properties)
}

export async function unassigned(user: User, role: string) {
  const properties: RoleUnassignedEvent = {}
  await publishEvent(Event.ROLE_UNASSIGNED, properties)
}
