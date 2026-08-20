import { context, roles } from "@budibase/backend-core"
import type { ChatApp } from "@budibase/types"
import sdk from "../../sdk"
import TestConfiguration from "../utilities/TestConfiguration"

describe("chat apps create validation", () => {
  const config = new TestConfiguration()

  beforeAll(async () => {
    await config.init("chat-app-create-validation")
  })

  afterAll(() => {
    config.end()
  })

  it("rejects null agents", async () => {
    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const payload = {
          agents: null,
        } as unknown as Omit<ChatApp, "_id" | "_rev">

        await expect(sdk.ai.chatApps.create(payload)).rejects.toThrow(
          "agents must contain valid agentId entries"
        )
      }
    )
  })

  it("normalizes agents to membership-only entries", async () => {
    await context.doInWorkspaceContext(
      config.getProdWorkspaceId(),
      async () => {
        const created = await sdk.ai.chatApps.create({
          agents: [
            {
              agentId: "agent-1",
              isEnabled: true,
              isDefault: true,
              roleId: roles.BUILTIN_ROLE_IDS.BASIC,
            } as any,
          ],
        })

        expect(created.agents).toEqual([{ agentId: "agent-1" }])
      }
    )
  })
})
