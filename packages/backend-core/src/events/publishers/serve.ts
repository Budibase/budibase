import {
  AppPreviewServedEvent,
  AppServedEvent,
  BuilderServedEvent,
  Event,
  Workspace,
} from "@budibase/types"
import { publishEvent } from "../events"

async function servedBuilder(timezone: string) {
  const properties: BuilderServedEvent = {
    timezone,
  }
  await publishEvent(Event.SERVED_BUILDER, properties)
}

async function servedApp(
  workspace: Workspace,
  timezone: string,
  embed?: boolean | undefined
) {
  const properties: AppServedEvent = {
    appVersion: workspace.version,
    timezone,
    embed: embed === true,
  }
  await publishEvent(Event.SERVED_APP, properties)
}

async function servedAppPreview(workspace: Workspace, timezone: string) {
  const properties: AppPreviewServedEvent = {
    appId: workspace.appId,
    appVersion: workspace.version,
    timezone,
  }
  await publishEvent(Event.SERVED_APP_PREVIEW, properties)
}

export default {
  servedBuilder,
  servedApp,
  servedAppPreview,
}
