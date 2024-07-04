import { Event, SMTPCreatedEvent, SMTPUpdatedEvent } from "@budibase/types"
import { publishEvent } from "../events"

async function SMTPCreated(timestamp?: string | number) {
  const properties: SMTPCreatedEvent = {}
  await publishEvent(Event.EMAIL_SMTP_CREATED, properties, timestamp)
}

async function SMTPUpdated() {
  const properties: SMTPUpdatedEvent = {}
  await publishEvent(Event.EMAIL_SMTP_UPDATED, properties)
}

export default {
  SMTPCreated,
  SMTPUpdated,
}
