import { publishEvent } from "../events"
import {
  Event,
  ScimUserCreatedEvent,
  ScimUserDeletedEvent,
  ScimUserUpdatedEvent,
} from "@budibase/types"

async function SCIMUserCreated(props: {
  userId: string
  timestamp?: string | number
}) {
  const properties: ScimUserCreatedEvent = {
    userId: props.userId,
  }
  await publishEvent(Event.SCIM_USER_CREATED, properties, props.timestamp)
}

async function SCIMUserUpdated(props: {
  userId: string
  timestamp?: string | number
}) {
  const properties: ScimUserUpdatedEvent = {
    userId: props.userId,
  }
  await publishEvent(Event.SCIM_USER_UPDATED, properties, props.timestamp)
}

async function SCIMUserDeleted(props: { userId: string }) {
  const properties: ScimUserDeletedEvent = {
    userId: props.userId,
  }
  await publishEvent(Event.SCIM_USER_DELETED, properties)
}

export default {
  SCIMUserCreated,
  SCIMUserUpdated,
  SCIMUserDeleted,
}
