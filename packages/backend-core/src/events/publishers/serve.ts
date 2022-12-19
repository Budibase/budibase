import { publishEvent } from "../events"
import {
  App,
  BuilderServedEvent,
  Event,
  AppPreviewServedEvent,
  AppServedEvent,
} from "@budibase/types"

export async function servedBuilder(timezone: string) {
  const properties: BuilderServedEvent = {
    timezone,
  }
  await publishEvent(Event.SERVED_BUILDER, properties)
}

export async function servedApp(app: App, timezone: string) {
  const properties: AppServedEvent = {
    appVersion: app.version,
    timezone,
  }
  await publishEvent(Event.SERVED_APP, properties)
}

export async function servedAppPreview(app: App, timezone: string) {
  const properties: AppPreviewServedEvent = {
    appId: app.appId,
    appVersion: app.version,
    timezone,
  }
  await publishEvent(Event.SERVED_APP_PREVIEW, properties)
}
