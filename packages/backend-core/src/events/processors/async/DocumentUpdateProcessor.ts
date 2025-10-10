import { DocUpdateEvent, Event, Identity } from "@budibase/types"
import { doInTenant } from "../../../context"
import { shutdown } from "../../asyncEvents"
import { getDocumentId } from "../../documentId"
import { EventProcessor } from "../types"

export type Processor = (update: DocUpdateEvent) => Promise<void>
export type ProcessorMap = { events: Event[]; processor: Processor }[]

export default class DocumentUpdateProcessor implements EventProcessor {
  processors: ProcessorMap = []

  constructor(processors: ProcessorMap) {
    this.processors = processors
  }

  async processEvent(event: Event, identity: Identity, properties: any) {
    const tenantId = identity.realTenantId
    const docId = getDocumentId(event, properties)
    if (!tenantId || !docId) {
      return
    }
    for (let { events, processor } of this.processors) {
      if (events.includes(event)) {
        await doInTenant(tenantId, async () => {
          await processor({
            id: docId,
            tenantId,
            appId: properties.appId,
            properties,
          })
        })
      }
    }
  }

  shutdown() {
    return shutdown()
  }
}
