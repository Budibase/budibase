import { context } from "@budibase/backend-core"
import type { AgentRequest } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import migration from "../20261006164506_backfill_agent_request_operation_ids"

const config = new TestConfiguration()

describe("backfill agent request operation IDs", () => {
  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => config.end())

  it("backfills only unambiguous open requests and is safe to rerun", async () => {
    await config.doInContext(config.getProdWorkspaceId(), async () => {
      const db = context.getWorkspaceDB()
      await db.put({
        _id: "agent_1",
        name: "Purchasing agent",
        aiconfig: "config_1",
        operations: [
          { id: "op_expenses", name: "Expenses" },
          { id: "op_books", name: "Books" },
        ],
      })
      const cases = [
        { id: "open", status: "active", names: ["Expenses"] },
        { id: "pending", status: "needs_input", names: ["Expenses"] },
        {
          id: "ambiguous",
          status: "needs_input",
          names: ["Expenses", "Books"],
        },
        { id: "missing", status: "needs_input", names: ["Removed operation"] },
        { id: "completed", status: "completed", names: ["Expenses"] },
        { id: "failed", status: "failed", names: ["Expenses"] },
        {
          id: "existing",
          status: "active",
          names: ["Expenses"],
          operationId: "op_books",
        },
      ]
      for (const entry of cases) {
        await db.put({
          _id: `agentrequest_${entry.id}`,
          agentId: "agent_1",
          userId: "user_1",
          status: entry.status,
          ...(entry.operationId ? { operationId: entry.operationId } : {}),
          entries: [
            {
              sessionId: "session_1",
              source: "Chat",
              operationNames: entry.names,
            },
          ],
          updatedAt: "2026-10-06T10:00:00.000Z",
        })
      }
      await migration()
      const migrated = await Promise.all(
        cases.map(entry => db.get<AgentRequest>(`agentrequest_${entry.id}`))
      )
      await migration()
      const rerun = await Promise.all(
        cases.map(entry => db.get<AgentRequest>(`agentrequest_${entry.id}`))
      )

      expect(migrated.map(request => request.operationId)).toEqual([
        "op_expenses",
        "op_expenses",
        undefined,
        undefined,
        undefined,
        undefined,
        "op_books",
      ])
      expect(rerun).toEqual(migrated)
      expect(migrated.map(request => request.status)).toEqual([
        "active",
        "needs_input",
        "needs_input",
        "needs_input",
        "completed",
        "failed",
        "active",
      ])
    })
  })
})
