import { AgentChannelProvider } from "@budibase/types"
import sdk from "../../../sdk"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

describe("chatIdentityLinks", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  it("reuses links across workspaces", async () => {
    const firstProdWorkspaceId = config.getProdWorkspaceId()
    await config.createWorkspace("Second workspace")
    const secondProdWorkspaceId = config.getProdWorkspaceId()

    let linkId: string | undefined
    await config.doInContext(firstProdWorkspaceId, async () => {
      const link = await sdk.ai.chatIdentityLinks.upsertChatIdentityLink({
        provider: AgentChannelProvider.SLACK,
        externalUserId: "external-user-1",
        teamId: "team-1",
        globalUserId: config.getUser()._id!,
        linkedBy: config.getUser()._id!,
      })
      linkId = link._id
    })

    await config.doInContext(secondProdWorkspaceId, async () => {
      const link = await sdk.ai.chatIdentityLinks.getChatIdentityLink({
        provider: AgentChannelProvider.SLACK,
        externalUserId: "external-user-1",
        teamId: "team-1",
      })

      expect(link?._id).toEqual(linkId)
      expect(link?.globalUserId).toEqual(config.getUser()._id)
    })
  })
})
