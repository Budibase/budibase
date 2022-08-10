import { EventEmitter } from "events"
import * as context from "../../context"
import { Identity, Event } from "@budibase/types"

export interface EmittedEvent {
  tenantId: string
  identity: Identity
  appId: string | undefined
  properties: any
}

class BBEventEmitter extends EventEmitter {
  emitEvent(event: Event, properties: any, identity: Identity) {
    const tenantId = context.getTenantId()
    const appId = context.getAppId()

    const emittedEvent: EmittedEvent = {
      tenantId,
      identity,
      appId,
      properties,
    }
    this.emit(event, emittedEvent)
  }
}

export const emitter = new BBEventEmitter()
