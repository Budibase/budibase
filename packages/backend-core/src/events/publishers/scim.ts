import { publishEvent } from "../events"
import {
  Event,
  ScimUserCreatedEvent,
  ScimUserUpdatedEvent,
} from "@budibase/types"

async function SCIMUserCreated(props: {
  email: string
  timestamp?: string | number
}) {
  const properties: ScimUserCreatedEvent = {
    email: props.email,
  }
  await publishEvent(Event.SCIM_USER_CREATED, properties, props.timestamp)
}

async function SCIMUserUpdated(props: {
  email: string
  timestamp?: string | number
}) {
  const properties: ScimUserUpdatedEvent = {
    email: props.email,
  }
  await publishEvent(Event.SCIM_USER_UPDATED, properties, props.timestamp)
}

export default {
  SCIMUserCreated,
  SCIMUserUpdated,
}
