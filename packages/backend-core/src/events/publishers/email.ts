import { publishEvent } from "../events"
import {
  Event,
  SMTPConfig,
  SMTPCreatedEvent,
  SMTPUpdatedEvent,
} from "@budibase/types"

export function SMTPCreated(config: SMTPConfig) {
  const properties: SMTPCreatedEvent = {}
  publishEvent(Event.EMAIL_SMTP_CREATED, properties)
}

export function SMTPUpdated(config: SMTPConfig) {
  const properties: SMTPUpdatedEvent = {}
  publishEvent(Event.EMAIL_SMTP_UPDATED, properties)
}
