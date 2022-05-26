import { Event, Identity } from "@budibase/types"

export enum EventProcessorType {
  POSTHOG = "posthog",
  LOGGING = "logging",
}

export interface EventProcessor {
  processEvent(
    event: Event,
    identity: Identity,
    properties: any,
    timestamp?: string | number
  ): Promise<void>
  identify(identity: Identity, timestamp?: string | number): Promise<void>
  shutdown(): void
}
