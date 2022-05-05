import { processEvent } from "../events"
import {
  Event,
  SMTPConfig,
  SMTPCreatedEvent,
  SMTPUpdatedEvent,
} from "@budibase/types"

export function SMTPCreated(config: SMTPConfig) {
  const properties: SMTPCreatedEvent = {}
  processEvent(Event.EMAIL_SMTP_CREATED, properties)
}

export function SMTPUpdated(config: SMTPConfig) {
  const properties: SMTPUpdatedEvent = {}
  processEvent(Event.EMAIL_SMTP_UPDATED, properties)
}
