import { v4 as uuidv4 } from "uuid"
import {
  DocumentType,
  Event,
  Identity,
  PlatformActionEvent,
  SEPARATOR,
} from "@budibase/types"
import * as context from "../../context"
import { EventProcessor } from "./types"

function isActionSourceContext(
  properties: Record<string, unknown>
): properties is Record<string, unknown> & {
  sourceType: string
  sourceId: string
} {
  return (
    typeof properties.sourceType === "string" &&
    typeof properties.sourceId === "string"
  )
}

export default class PlatformActionPersistProcessor implements EventProcessor {
  async processEvent(
    event: Event,
    _identity: Identity,
    properties: Record<string, unknown>,
    timestamp?: string | number
  ): Promise<void> {
    if (!event.startsWith("action:") || !isActionSourceContext(properties)) {
      return
    }

    const { sourceType, sourceId, ...payload } = properties
    const doc: PlatformActionEvent = {
      _id: `${
        DocumentType.PLATFORM_ACTION_EVENT
      }${SEPARATOR}${new Date().toISOString()}${SEPARATOR}${uuidv4()}`,
      sourceType: sourceType as PlatformActionEvent["sourceType"],
      sourceId,
      eventName: event,
      timestamp:
        timestamp === undefined
          ? new Date().toISOString()
          : new Date(timestamp).toISOString(),
      payload,
    }

    try {
      await context.getWorkspaceDB().put(doc)
    } catch (err) {
      console.error("Failed to persist platform action event", {
        event,
        sourceType,
        sourceId,
        err,
      })
    }
  }
}
