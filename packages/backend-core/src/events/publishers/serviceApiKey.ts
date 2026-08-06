import {
  Event,
  ServiceApiKeyCreatedEvent,
  ServiceApiKeyRevokedEvent,
  ServiceApiKeySummary,
} from "@budibase/types"
import { publishEvent } from "../events"

const created = async (serviceApiKey: ServiceApiKeySummary) => {
  const properties: ServiceApiKeyCreatedEvent = {
    serviceApiKeyId: serviceApiKey._id!,
    audited: { name: serviceApiKey.name },
  }
  await publishEvent(Event.SERVICE_API_KEY_CREATED, properties)
}

const revoked = async (serviceApiKey: ServiceApiKeySummary) => {
  const properties: ServiceApiKeyRevokedEvent = {
    serviceApiKeyId: serviceApiKey._id!,
    audited: { name: serviceApiKey.name },
  }
  await publishEvent(Event.SERVICE_API_KEY_REVOKED, properties)
}

export default { created, revoked }
