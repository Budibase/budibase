import { v4 as uuidv4 } from "uuid"
import {
  DocumentType,
  Event,
  Identity,
  PlatformActionEvent,
  PlatformActionSessionIndexJob,
  PlatformActionSourceType,
  SEPARATOR,
} from "@budibase/types"
import * as context from "../../../context"
import { timeout } from "../../../utils"
import { EventProcessor } from "../types"
import { enqueuePlatformActionSessionIndex } from "./indexQueue"

const ENQUEUE_MAX_ATTEMPTS = 3
const ENQUEUE_RETRY_DELAY_MS = 200

function toCompactTimestamp(isoTimestamp: string): string {
  return isoTimestamp.replace(/[-:.]/g, "")
}

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
    const platformActionEventId = `${DocumentType.PLATFORM_ACTION_EVENT}${SEPARATOR}${toCompactTimestamp(
      isoTimestamp
    )}${SEPARATOR}${uuidv4()}`
    const doc: PlatformActionEvent = {
      _id: platformActionEventId,
      sourceType: sourceType as PlatformActionSourceType,
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
    if (!workspaceId) {
      return
    }

    const indexJob: PlatformActionSessionIndexJob = {
      workspaceId,
      platformActionId: platformActionEventId,
      sourceType: doc.sourceType,
      sourceId: doc.sourceId,
      eventName: event,
      outcome: event.endsWith(":failed") ? "failure" : "success",
      timestamp: isoTimestamp,
    }

    for (let attempt = 1; attempt <= ENQUEUE_MAX_ATTEMPTS; attempt++) {
      try {
        await enqueuePlatformActionSessionIndex(indexJob)
        return
      } catch (err) {
        if (attempt === ENQUEUE_MAX_ATTEMPTS) {
          console.error("Failed to enqueue platform action session index job", {
            event,
            sourceType,
            sourceId,
            err,
          })
          return
        }
        await timeout(ENQUEUE_RETRY_DELAY_MS * attempt)
      }
    }
  }
}
