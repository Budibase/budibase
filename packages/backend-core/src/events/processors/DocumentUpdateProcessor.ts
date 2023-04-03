import { Event, Identity, Group, DocumentUpdateEvents } from "@budibase/types"
import { EventProcessor } from "./types"
import * as docUpdates from "../../docUpdates"
import { getTenantId } from "../../context"

export default class DocumentUpdateProcessor implements EventProcessor {
  async processEvent(
    event: Event,
    identity: Identity,
    properties: any,
    timestamp?: string
  ): Promise<void> {
    // only user and group IDs supported right now - no app documents yet
    if (DocumentUpdateEvents.indexOf(event) !== -1 && identity.tenantId) {
      await docUpdates.update({
        id: this.getId(properties),
        tenantId: getTenantId(),
      })
    }
  }

  getId(properties: any) {
    let possibleProps = ["groupId", "userId"]
    for (let prop of possibleProps) {
      if (properties[prop]) {
        return properties[prop]
      }
    }
  }

  async identify(identity: Identity, timestamp?: string | number) {
    // no-op
  }

  async identifyGroup(group: Group, timestamp?: string | number) {
    // no-op
  }

  shutdown(): void {
    docUpdates.shutdown()
  }
}
