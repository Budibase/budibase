import { EventProcessor } from "../types"
import { Event, Identity, DocUpdateEvent } from "@budibase/types"
import { DocumentType, SEPARATOR } from "../../../constants"
import { doInTenant } from "../../../context"
import { getDocumentId } from "../../documentId"
import { shutdown } from "../../asyncEvents"

export type Processor = (update: DocUpdateEvent) => Promise<void>
export type ProcessorMap = { types: DocumentType[]; processor: Processor }[]

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
    const tenantId = identity.tenantId
    const docId = getDocumentId(event, properties)
    if (!tenantId || !docId) {
      return
    }
    for (let { types, processor } of this.processors) {
      if (types.find(type => docId.startsWith(`${type}${SEPARATOR}`))) {
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
