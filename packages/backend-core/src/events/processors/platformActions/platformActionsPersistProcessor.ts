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
import { doWithExistingActionsWorkspace, getActionsDB } from "./db"
import { enqueuePlatformActionSessionIndex } from "./indexQueue"

const ENQUEUE_MAX_ATTEMPTS = 3
const ENQUEUE_RETRY_DELAY_MS = 200

function toCompactTimestamp(isoTimestamp: string): string {
  return isoTimestamp.replace(/[-:.]/g, "")
}

const isAgentToolEvent = (event: Event) =>
  event === Event.ACTION_AI_AGENT_TOOL_EXECUTED ||
  event === Event.ACTION_AI_AGENT_TOOL_FAILED

interface PersistableAction {
  sourceType: PlatformActionSourceType
  sourceId: string
  payload: Record<string, unknown>
}

// The tool event's own sourceType is the tool type (INTERNAL_TABLE,
// AUTOMATION...), not an Activity container. The call belongs to the agent
// session that ran it, and the payload keeps the event unchanged.
function fromAgentToolEvent(
  properties: Record<string, unknown>
): PersistableAction | undefined {
  if (typeof properties.sessionId !== "string") {
    return undefined
  }
  return {
    sourceType: "agent_session",
    sourceId: properties.sessionId,
    payload: properties,
  }
}

function fromActionSourceContext(
  properties: Record<string, unknown>
): PersistableAction | undefined {
  const { sourceType, sourceId, ...payload } = properties
  if (typeof sourceType !== "string" || typeof sourceId !== "string") {
    return undefined
  }
  return {
    sourceType: sourceType as PlatformActionSourceType,
    sourceId,
    payload,
  }
}

function getSessionSignal(
  event: Event,
  properties: Record<string, unknown>
): PlatformActionSessionIndexJob["signal"] {
  if (isAgentToolEvent(event)) {
    // A failed tool doesn't fail the session: the agent can recover, and only
    // its lifecycle events decide the session status
    return undefined
  }
  if (properties.sourceType === "automation_run") {
    // A step succeeding or failing mid-run isn't the run's terminal state
    // (continueOnError can keep the run going past a failure). The
    // orchestrator signals active/completed/failed explicitly from the run's
    // own global outcome instead
    return undefined
  }
  if (event.endsWith(":failed")) {
    return "failed"
  }
  if (
    event === Event.ACTION_AI_AGENT_EXECUTED &&
    (properties.finalStatus === "completed" ||
      properties.finalStatus === "failed")
  ) {
    return properties.finalStatus
  }
  if (
    event === Event.ACTION_AI_AGENT_EXECUTED &&
    properties.awaitingEscalation === true
  ) {
    return "waiting"
  }
  return "completed"
}

export default class PlatformActionPersistProcessor implements EventProcessor {
  async processEvent(
    event: Event,
    _identity: Identity,
    properties: Record<string, unknown>,
    timestamp?: string | number
  ): Promise<void> {
    if (!event.startsWith("action:")) {
      return
    }
    const action = isAgentToolEvent(event)
      ? fromAgentToolEvent(properties)
      : fromActionSourceContext(properties)
    if (!action) {
      return
    }

    const workspaceId = context.getWorkspaceId()
    if (!workspaceId || context.isSelfHostUsingCloud()) {
      return
    }
    const environment = context.getPlatformActionEnvironment()

    const { sourceType, sourceId, payload } = action
    const isoTimestamp =
      timestamp === undefined
        ? new Date().toISOString()
        : new Date(timestamp).toISOString()
    const platformActionEventId = `${DocumentType.PLATFORM_ACTION_EVENT}${SEPARATOR}${toCompactTimestamp(
      isoTimestamp
    )}${SEPARATOR}${uuidv4()}`
    const doc: PlatformActionEvent = {
      _id: platformActionEventId,
      sourceType,
      sourceId,
      environment,
      eventName: event,
      timestamp: isoTimestamp,
      payload,
    }

    try {
      const persisted = await doWithExistingActionsWorkspace(async () => {
        await getActionsDB().put(doc)
      })
      if (!persisted) {
        // The workspace was deleted while this event was in flight
        return
      }
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

    const indexJob: PlatformActionSessionIndexJob = {
      workspaceId,
      environment,
      indexId: platformActionEventId,
      sourceType: doc.sourceType,
      sourceId: doc.sourceId,
      incrementsActionCount: true,
      signal: getSessionSignal(event, properties),
      timestamp: isoTimestamp,
      metadata: context.getPlatformActionSessionMetadata(doc),
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
