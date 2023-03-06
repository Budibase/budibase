import { AnalyticsClient } from "./analytics/Client"

const client = new AnalyticsClient()

export function captureEvent(event: string, properties: any) {
  client.capture({
    distinctId: "cli",
    event,
    properties,
  })
}
