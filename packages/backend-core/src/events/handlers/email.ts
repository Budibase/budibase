import { processEvent } from "../events"
import {
  Events,
  SMTPConfig,
  SMTPCreatedEvent,
  SMTPUpdatedEvent,
} from "@budibase/types"

export function SMTPCreated(config: SMTPConfig) {
  const properties: SMTPCreatedEvent = {}
  processEvent(Events.EMAIL_SMTP_CREATED, properties)
}

export function SMTPUpdated(config: SMTPConfig) {
  const properties: SMTPUpdatedEvent = {}
  processEvent(Events.EMAIL_SMTP_UPDATED, properties)
}
