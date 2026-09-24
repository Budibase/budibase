import { publishEvent } from "../events"
import {
  Event,
  type FunctionDeletedEvent,
  type FunctionDocument,
} from "@budibase/types"

const deleted = async (fn: FunctionDocument) => {
  const properties: FunctionDeletedEvent = {
    appId: fn.appId,
    functionId: fn._id!,
    audited: { name: fn.name },
  }
  await publishEvent(Event.FUNCTION_DELETED, properties)
}

export default { deleted }
