import { publishEvent } from "../events"
import {
  App,
  BuilderServedEvent,
  Event,
  AppPreviewServedEvent,
  AppServedEvent,
} from "@budibase/types"

/* eslint-disable */

export function servedBuilder(version: number) {
  const properties: BuilderServedEvent = {}
  publishEvent(Event.SERVED_BUILDER, properties)
}

export function servedApp(app: App) {
  const properties: AppServedEvent = {}
  publishEvent(Event.SERVED_APP, properties)
}

export function servedAppPreview(app: App) {
  const properties: AppPreviewServedEvent = {}
  publishEvent(Event.SERVED_APP_PREVIEW, properties)
}
