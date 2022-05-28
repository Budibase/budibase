import { publishEvent } from "../events"
import {
  App,
  BuilderServedEvent,
  Event,
  AppPreviewServedEvent,
  AppServedEvent,
} from "@budibase/types"

/* eslint-disable */

export async function servedBuilder() {
  const properties: BuilderServedEvent = {}
  await publishEvent(Event.SERVED_BUILDER, properties)
}

export async function servedApp(app: App) {
  const properties: AppServedEvent = {
    appId: app.appId,
    appVersion: app.version,
  }
  await publishEvent(Event.SERVED_APP, properties)
}

export async function servedAppPreview(app: App) {
  const properties: AppPreviewServedEvent = {
    appId: app.appId,
    appVersion: app.version,
  }
  await publishEvent(Event.SERVED_APP_PREVIEW, properties)
}
