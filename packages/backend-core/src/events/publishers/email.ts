import { publishEvent } from "../events"
import {
  Event,
  SMTPConfig,
  SMTPCreatedEvent,
  SMTPUpdatedEvent,
} from "@budibase/types"

export async function SMTPCreated(config: SMTPConfig) {
  const properties: SMTPCreatedEvent = {}
  await publishEvent(Event.EMAIL_SMTP_CREATED, properties)
}

export async function SMTPUpdated(config: SMTPConfig) {
  const properties: SMTPUpdatedEvent = {}
  await publishEvent(Event.EMAIL_SMTP_UPDATED, properties)
}
