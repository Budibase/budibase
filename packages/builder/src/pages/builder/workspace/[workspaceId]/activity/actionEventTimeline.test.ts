import { describe, expect, it } from "vitest"
import dayjs from "dayjs"
import {
  ActionFailureReason,
  Event,
  type ActionEvent,
  type ActionSession,
} from "@budibase/types"
import { toActionTimelineItem } from "./actionEventTimeline"

const timestamp = "2026-10-05T11:00:00.000Z"
const formattedTimestamp = dayjs(timestamp).format("MMM D, YYYY h:mm A")

const toItem = (event: Partial<ActionEvent>) =>
  toActionTimelineItem({
    event: {
      id: "event-1",
      eventName: Event.ACTION_AUTOMATION_STEP_EXECUTED,
      timestamp,
      payload: {},
      ...event,
    },
    stepNames: { CREATE_ROW: "Create Row" },
    agentNames: { "agent-1": "Support agent" },
  })

describe("toActionTimelineItem", () => {
  const session: ActionSession = {
    sourceType: "agent_session",
    sourceId: "session-1",
    environment: "dev",
    status: "completed",
    actionCount: 1,
    startedAt: timestamp,
    updatedAt: timestamp,
    assetType: "agent",
    assetId: "agent-1",
    assetLabel: "Historical agent",
  }

  it.each([
    {
      currentName: "Renamed agent",
      eventName: Event.ACTION_AI_AGENT_EXECUTED,
      verb: "executed",
    },
    {
      currentName: undefined,
      eventName: Event.ACTION_AI_AGENT_EXECUTED,
      verb: "executed",
    },
    {
      currentName: "Renamed agent",
      eventName: Event.ACTION_AI_AGENT_FAILED,
      verb: "failed",
    },
  ])(
    "uses the snapshot for $verb with current name $currentName",
    ({ currentName, eventName, verb }) => {
      expect(
        toActionTimelineItem({
          event: {
            id: "event-1",
            eventName,
            timestamp,
            payload: { agentId: "agent-1" },
          },
          stepNames: {},
          agentNames: currentName ? { "agent-1": currentName } : {},
          session,
        }).label
      ).toBe(`Agent ${verb}: Historical agent`)
    }
  )

  it.each([
    { assetId: "another-agent" },
    { assetType: "automation" },
    { assetLabel: undefined },
  ])("keeps the lookup fallback for an unusable snapshot %j", overrides => {
    expect(
      toActionTimelineItem({
        event: {
          id: "event-1",
          eventName: Event.ACTION_AI_AGENT_EXECUTED,
          timestamp,
          payload: { agentId: "agent-1" },
        },
        stepNames: {},
        agentNames: { "agent-1": "Current agent" },
        session: { ...session, ...overrides },
      }).label
    ).toBe("Agent executed: Current agent")
  })

  it("labels an executed automation step with its name", () => {
    expect(toItem({ payload: { stepId: "CREATE_ROW" } })).toEqual({
      id: "event-1",
      timestamp: formattedTimestamp,
      label: "Step executed: Create Row",
    })
  })

  it("labels a failed automation step with its error message", () => {
    expect(
      toItem({
        eventName: Event.ACTION_AUTOMATION_STEP_FAILED,
        payload: {
          stepId: "CREATE_ROW",
          reason: ActionFailureReason.ERROR,
          errorMessage: "Table not found",
        },
      })
    ).toMatchObject({
      label: "Step failed: Create Row",
      detail: "Table not found",
    })
  })

  it("describes the failure reason when there is no error message", () => {
    expect(
      toItem({
        eventName: Event.ACTION_AUTOMATION_STEP_FAILED,
        payload: {
          stepId: "LOOP",
          reason: ActionFailureReason.MAX_ITERATIONS,
        },
      })
    ).toMatchObject({
      label: "Step failed: LOOP",
      detail: "Maximum iterations reached",
    })
  })

  it("labels agent events with the agent name", () => {
    expect(
      toItem({
        eventName: Event.ACTION_AI_AGENT_EXECUTED,
        payload: { agentId: "agent-1", awaitingEscalation: true },
      })
    ).toMatchObject({
      label: "Agent executed: Support agent",
      detail: "Waiting for approval",
    })
    expect(
      toItem({
        eventName: Event.ACTION_AI_AGENT_FAILED,
        payload: { agentId: "agent-1", reason: ActionFailureReason.ERROR },
      })
    ).toMatchObject({ label: "Agent failed: Support agent", detail: "Error" })
  })

  it.each([undefined, "completed"])(
    "labels a normal agent execution with finalStatus %s",
    finalStatus => {
      expect(
        toItem({
          eventName: Event.ACTION_AI_AGENT_EXECUTED,
          payload: { agentId: "agent-1", finalStatus },
        })
      ).toMatchObject({
        label: "Agent executed: Support agent",
        detail: undefined,
      })
    }
  )

  it.each([undefined, true])(
    "prioritises a failed final status with awaitingEscalation %s",
    awaitingEscalation => {
      expect(
        toItem({
          eventName: Event.ACTION_AI_AGENT_EXECUTED,
          payload: {
            agentId: "agent-1",
            finalStatus: "failed",
            awaitingEscalation,
          },
        })
      ).toMatchObject({
        label: "Agent failed: Support agent",
        detail: undefined,
      })
    }
  )

  it("includes failure details for an executed agent with a failed outcome", () => {
    expect(
      toItem({
        eventName: Event.ACTION_AI_AGENT_EXECUTED,
        payload: {
          agentId: "agent-1",
          finalStatus: "failed",
          errorMessage: "Tool execution failed",
        },
      })
    ).toMatchObject({
      label: "Agent failed: Support agent",
      detail: "Tool execution failed",
    })
  })

  it("falls back when the payload is incomplete or malformed", () => {
    expect(toItem({ payload: { stepId: 42 } })).toMatchObject({
      label: "Step executed: Unknown step",
    })
    expect(
      toItem({
        eventName: Event.ACTION_AI_AGENT_FAILED,
        payload: { agentId: "missing", reason: "unexpected" },
      })
    ).toEqual({
      id: "event-1",
      timestamp: formattedTimestamp,
      label: "Agent failed: Unknown agent",
      detail: undefined,
    })
    expect(toItem({ timestamp: "not a date" }).timestamp).toBe("Unknown time")
  })

  it("shows the raw name of an unknown event", () => {
    expect(toItem({ eventName: "action:something:new" })).toMatchObject({
      label: "action:something:new",
    })
  })
})
