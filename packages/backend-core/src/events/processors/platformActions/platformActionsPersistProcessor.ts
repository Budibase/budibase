import { v4 as uuidv4 } from "uuid"
import {
  DocumentType,
  Event,
  Identity,
  PlatformActionEvent,
  SEPARATOR,
} from "@budibase/types"
import * as context from "../../../context"
import { EventProcessor } from "../types"
import { enqueuePlatformActionSessionIndex } from "./indexQueue"

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
    const isoTimestamp =
      timestamp === undefined
        ? new Date().toISOString()
        : new Date(timestamp).toISOString()
    const doc: PlatformActionEvent = {
      _id: `${
        DocumentType.PLATFORM_ACTION_EVENT
      }${SEPARATOR}${new Date().toISOString()}${SEPARATOR}${uuidv4()}`,
      sourceType: sourceType as PlatformActionEvent["sourceType"],
      sourceId,
      eventName: event,
      timestamp: isoTimestamp,
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
      // Don't materialize a session update for an event whose detail doc
      // was never persisted. The list would show a count the timeline
      // can't back up.
      return
    }

    const workspaceId = context.getWorkspaceId()
    if (workspaceId) {
      try {
        await enqueuePlatformActionSessionIndex({
          workspaceId,
          sourceType: doc.sourceType,
          sourceId: doc.sourceId,
          eventName: event,
          outcome: event.endsWith(":failed") ? "failure" : "success",
          timestamp: isoTimestamp,
        })
      } catch (err) {
        console.error("Failed to enqueue platform action session index job", {
          event,
          sourceType,
          sourceId,
          err,
        })
      }
    }
  }
}
