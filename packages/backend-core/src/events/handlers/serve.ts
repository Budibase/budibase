import { processEvent } from "../events"
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
  processEvent(Event.SERVED_BUILDER, properties)
}

export function servedApp(app: App) {
  const properties: AppServedEvent = {}
  processEvent(Event.SERVED_APP, properties)
}

export function servedAppPreview(app: App) {
  const properties: AppPreviewServedEvent = {}
  processEvent(Event.SERVED_APP_PREVIEW, properties)
}
