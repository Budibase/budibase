import { EventProcessor } from "../types"
import { Event, Identity, DocUpdateEvent } from "@budibase/types"
import { doInTenant } from "../../../context"
import { getDocumentId } from "../../documentId"
import { shutdown } from "../../asyncEvents"

export type Processor = (update: DocUpdateEvent) => Promise<void>
export type ProcessorMap = { events: Event[]; processor: Processor }[]

export default class DocumentUpdateProcessor implements EventProcessor {
  processors: ProcessorMap = []

  constructor(processors: ProcessorMap) {
    this.processors = processors
  }

  async processEvent(
    event: Event,
    identity: Identity,
    properties: any,
    timestamp?: string | number
  ) {
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
          })
        })
      }
    }
  }

  shutdown() {
    return shutdown()
  }
}
