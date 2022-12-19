import { publishEvent } from "../events"
import { Event, SMTPCreatedEvent, SMTPUpdatedEvent } from "@budibase/types"

export async function SMTPCreated(timestamp?: string | number) {
  const properties: SMTPCreatedEvent = {}
  await publishEvent(Event.EMAIL_SMTP_CREATED, properties, timestamp)
}

export async function SMTPUpdated() {
  const properties: SMTPUpdatedEvent = {}
  await publishEvent(Event.EMAIL_SMTP_UPDATED, properties)
}
