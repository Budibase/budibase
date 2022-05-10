import { Event } from "@budibase/types"

export enum EventProcessorType {
  POSTHOG = "posthog",
  LOGGING = "logging",
}

export interface EventProcessor {
  processEvent(event: Event, properties: any): void
  shutdown(): void
}
