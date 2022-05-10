import { Event } from "@budibase/types"
import { processors } from "./processors"

export const publishEvent = (event: Event, properties: any) => {
  // in future this should use async events
  // via a queue. For now we can use sync as
  // this is non-blocking
  processors.processEvent(event, properties)
}
