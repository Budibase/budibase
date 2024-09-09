import { publishEvent } from "../events"
import {
  Event,
  AIConfigCreatedEvent,
  AIConfigUpdatedEvent,
} from "@budibase/types"

async function AIConfigCreated(timestamp?: string | number) {
  const properties: AIConfigCreatedEvent = {}
  await publishEvent(Event.AI_CONFIG_CREATED, properties, timestamp)
}

async function AIConfigUpdated() {
  const properties: AIConfigUpdatedEvent = {}
  await publishEvent(Event.AI_CONFIG_UPDATED, properties)
}

export default {
  AIConfigCreated,
  AIConfigUpdated,
}
