import { Event } from "@budibase/types"
import { publishEvent } from "../events"

async function duplicatedToWorkspace(
  {
    resource,
    fromWorkspace,
    toWorkspace,
  }: {
    resource: {
      type: string
      id: string
      name: string
    }
    fromWorkspace: string
    toWorkspace: string
  },
  timestamp?: number
) {
  const properties = {
    resource,
    fromWorkspace,
    toWorkspace,
  }
  await publishEvent(Event.RESOURCE_COPIED_TO_WORKSPACE, properties, timestamp)
}

export default {
  duplicatedToWorkspace,
}
