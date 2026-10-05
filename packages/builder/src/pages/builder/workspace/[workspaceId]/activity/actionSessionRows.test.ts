import { describe, expect, it } from "vitest"
import type { ActionSession } from "@budibase/types"
import dayjs from "dayjs"
import {
  getActionSessionDetails,
  getActionSessionTitle,
  toActionSessionRow,
} from "./actionSessionRows"

const now = new Date("2026-10-05T12:00:00.000Z").getTime()

const session: ActionSession = {
  sourceType: "automation_run",
  sourceId: "run/1",
  environment: "prod",
  status: "waiting",
  actionCount: 3,
  startedAt: "2026-10-05T11:00:00.000Z",
  updatedAt: "2026-10-05T11:55:00.000Z",
}

describe("toActionSessionRow", () => {
  it("maps a session using its labels", () => {
    expect(
      toActionSessionRow({
        session: {
          ...session,
          sourceType: "agent_session",
          assetLabel: "Support agent",
          triggeredByLabel: "Jane Doe",
        },
        now,
      })
    ).toEqual({
      _id: "prod/agent_session/run/1",
      typeLabel: "Agent request",
      typeIcon: "sparkle",
      typeIconColor: "var(--color-brand-400)",
      assetLabel: "Support agent",
      triggeredByLabel: "Jane Doe",
      status: "waiting",
      statusLabel: "waiting",
      actionCount: 3,
      updatedLabel: "5 minutes ago",
    })
  })

  it("falls back when optional labels or the update time are missing", () => {
    const row = toActionSessionRow({
      session: { ...session, updatedAt: "not a date" },
      now,
    })

    expect(row).toMatchObject({
      typeLabel: "Automation run",
      typeIcon: "path",
      typeIconColor: "var(--color-purple-300)",
      assetLabel: "Unknown asset",
      triggeredByLabel: "Unknown",
      updatedLabel: "Unknown time",
    })
  })

  it("distinguishes the same source across environments", () => {
    const prodRow = toActionSessionRow({ session, now })
    const devRow = toActionSessionRow({
      session: { ...session, environment: "dev" },
      now,
    })

    expect(prodRow._id).not.toBe(devRow._id)
  })
})

describe("getActionSessionTitle", () => {
  it("uses the asset label when available", () => {
    expect(
      getActionSessionTitle({ ...session, assetLabel: "Nightly sync" })
    ).toBe("Nightly sync")
  })

  it("falls back to the session type", () => {
    expect(getActionSessionTitle(session)).toBe("Automation run")
  })
})

describe("getActionSessionDetails", () => {
  it("describes the session with explicit fallbacks", () => {
    expect(getActionSessionDetails(session)).toEqual([
      { type: "status-badge", label: "Status", status: "waiting" },
      {
        type: "text",
        label: "Type",
        value: "Automation run",
        icon: "path",
        iconColor: "var(--color-purple-300)",
        highlight: true,
      },
      { type: "text", label: "Asset", value: "Unknown asset", icon: "cube" },
      { type: "text", label: "Triggered by", value: "Unknown", icon: "user" },
      {
        type: "text",
        label: "Environment",
        value: "Production",
        icon: "globe",
      },
      { type: "text", label: "Actions", value: "3", icon: "list-checks" },
      {
        type: "text",
        label: "Started at",
        value: dayjs(session.startedAt).format("MMM D, YYYY h:mm A"),
        icon: "calendar",
      },
    ])
  })
})
