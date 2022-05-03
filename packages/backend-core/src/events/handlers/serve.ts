import { processEvent } from "../events"
import {
  App,
  BuilderServedEvent,
  Events,
  AppPreviewServedEvent,
  AppServedEvent,
} from "@budibase/types"

/* eslint-disable */

export function servedBuilder(version: number) {
  const properties: BuilderServedEvent = {}
  processEvent(Events.SERVED_BUILDER, properties)
}

export function servedApp(app: App) {
  const properties: AppServedEvent = {}
  processEvent(Events.SERVED_APP, properties)
}

export function servedAppPreview(app: App) {
  const properties: AppPreviewServedEvent = {}
  processEvent(Events.SERVED_APP_PREVIEW, properties)
}
