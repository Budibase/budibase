import { publishEvent } from "../events"
import {
  Event,
  ScimUserDeletedEvent,
  ScimUserUpdatedEvent,
} from "@budibase/types"

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
  SCIMUserUpdated,
  SCIMUserDeleted,
}
