import { Event, Identity, Group } from "@budibase/types"
import { EventProcessor } from "./types"

export default class Processor implements EventProcessor {
  initialised = false
  processors: EventProcessor[] = []

  constructor(processors: EventProcessor[]) {
    this.processors = processors
  }

  async processEvent(
    event: Event,
    identity: Identity,
    properties: any,
    timestamp?: string | number
  ): Promise<void> {
    for (const eventProcessor of this.processors) {
      await eventProcessor.processEvent(event, identity, properties, timestamp)
    }
  }

  async identify(
    identity: Identity,
    timestamp?: string | number
  ): Promise<void> {
    for (const eventProcessor of this.processors) {
      if (eventProcessor.identify) {
        await eventProcessor.identify(identity, timestamp)
      }
    }
  }

  async identifyGroup(
    identity: Group,
    timestamp?: string | number
  ): Promise<void> {
    for (const eventProcessor of this.processors) {
      if (eventProcessor.identifyGroup) {
        await eventProcessor.identifyGroup(identity, timestamp)
      }
    }
  }

  shutdown() {
    for (const eventProcessor of this.processors) {
      if (eventProcessor.shutdown) {
        eventProcessor.shutdown()
      }
    }
  }
}
