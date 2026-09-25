import * as dbCore from "../../../../db"
import { structures } from "../../../../../tests"
import * as context from "../../../../context"
import { getActionsDB, getActionsDbName } from "../db"
import { upsertPlatformActionSession } from "../sessionIndex"
import { getPlatformActionSessionId } from "../utils"
import type {
  PlatformActionEvent,
  PlatformActionSessionIndexDoc,
} from "@budibase/types"

describe("getActionsDbName", () => {
  it("prefixes a single-tenant prod workspace ID", () => {
    const workspaceId = dbCore.generateWorkspaceID()

    expect(getActionsDbName(workspaceId)).toBe(`actions_${workspaceId}`)
  })

  it("prefixes a multi-tenant prod workspace ID", () => {
    const workspaceId = dbCore.generateWorkspaceID(structures.tenant.id())

    expect(getActionsDbName(workspaceId)).toBe(`actions_${workspaceId}`)
  })

  it("normalizes a dev workspace ID to its prod equivalent", () => {
    const prodWorkspaceId = dbCore.generateWorkspaceID(structures.tenant.id())
    const devWorkspaceId = dbCore.getDevWorkspaceID(prodWorkspaceId)

    expect(getActionsDbName(devWorkspaceId)).toBe(
      `actions_${prodWorkspaceId}`
    )
  })
})

describe("getActionsDB", () => {
  it("isolates actions and session updates between workspaces in the same tenant", async () => {
    const tenantId = structures.tenant.id()
    const firstWorkspaceId = dbCore.generateWorkspaceID(tenantId)
    const secondWorkspaceId = dbCore.generateWorkspaceID(tenantId)
    const source = {
      environment: "prod" as const,
      sourceType: "agent_session" as const,
      sourceId: "shared-session",
    }
    const timestamp = "2026-09-22T10:00:00.000Z"
    const actionId = "platform_action_shared-event"

    for (const workspaceId of [firstWorkspaceId, secondWorkspaceId]) {
      await context.doInWorkspaceContext(workspaceId, async () => {
        await getActionsDB().put<PlatformActionEvent>({
          _id: actionId,
          ...source,
          timestamp,
          eventName: "action:ai_agent:executed",
          payload: { workspaceId },
        })
        await upsertPlatformActionSession({
          ...source,
          incrementsActionCount: true,
          signal: "completed",
          timestamp,
        })
      })
    }

    await context.doInWorkspaceContext(firstWorkspaceId, async () => {
      await upsertPlatformActionSession({
        ...source,
        incrementsActionCount: false,
        signal: "active",
        timestamp: "2026-09-22T11:00:00.000Z",
      })
    })

    for (const workspaceId of [firstWorkspaceId, secondWorkspaceId]) {
      await context.doInWorkspaceContext(workspaceId, async () => {
        const action = await getActionsDB().get<PlatformActionEvent>(actionId)
        const session = await getActionsDB().get<PlatformActionSessionIndexDoc>(
          getPlatformActionSessionId(source)
        )
        expect(action.payload).toEqual({ workspaceId })
        expect(session.actionCount).toBe(1)
        expect(session.status).toBe(
          workspaceId === firstWorkspaceId ? "active" : "completed"
        )
      })
    }
  })

  it("resolves the same DB name whether called from prod or dev context", async () => {
    const prodWorkspaceId = dbCore.generateWorkspaceID(structures.tenant.id())
    const devWorkspaceId = dbCore.getDevWorkspaceID(prodWorkspaceId)
    const expectedName = getActionsDbName(prodWorkspaceId)

    const nameFromProd = await context.doInWorkspaceContext(
      prodWorkspaceId,
      async () => getActionsDB().name
    )
    const nameFromDev = await context.doInWorkspaceContext(
      devWorkspaceId,
      async () => getActionsDB().name
    )

    expect(nameFromProd).toBe(expectedName)
    expect(nameFromDev).toBe(expectedName)
  })

  it("throws when there is no workspace in context", async () => {
    expect(() => getActionsDB()).toThrow(
      "Unable to retrieve actions DB - no workspace ID."
    )
  })

  it("rejects self-host cloud access even with a workspace in context", async () => {
    const tenantId = structures.tenant.id()
    const workspaceId = dbCore.generateWorkspaceID(tenantId)

    await context.doInWorkspaceContext(workspaceId, () =>
      context.doInSelfHostTenantUsingCloud(tenantId, () => {
        expect(() => getActionsDB()).toThrow(
          "Actions DB not found - self-host users using cloud don't have Actions DBs"
        )
      })
    )
  })
})
