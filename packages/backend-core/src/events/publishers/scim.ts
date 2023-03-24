import { publishEvent } from "../events"
import { Event, ScimUserCreatedEvent } from "@budibase/types"

async function SCIMUserCreated(props: {
  email: string
  timestamp?: string | number
}) {
  const properties: ScimUserCreatedEvent = {
    email: props.email,
  }
  await publishEvent(Event.SCIM_USER_CREATED, properties, props.timestamp)
}

export default {
  SCIMUserCreated,
}
