import { roles } from "@budibase/backend-core"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import sdk from "../../../../sdk"
import { resolveWebhookAuthorization } from "../authorization"

describe("webhook authorization", () => {
  const config = new TestConfiguration()

  beforeEach(async () => {
    await config.newTenant()
  })

  afterAll(() => {
    config.end()
  })

  const provisionMappedTeamsAgent = async () => {
    const agent = await config.api.agent.create({
      name: "Mapped Teams Agent",
      MSTeamsIntegration: {
        appId: "teams-app-id",
        appPassword: "teams-app-password",
        tenantId: "tenant-1",
        chatAppId: "chatapp-teams",
        allowedTenantIds: ["tenant-1"],
        allowedTeamIds: ["team-1"],
        allowedChannelIds: ["channel-1"],
      },
    })
    await config.publish()
    return agent
  }

  it("resolves a mapped Budibase user for Teams", async () => {
    const agent = await provisionMappedTeamsAgent()
    const mappedUser = await config.createUser({
      email: "mapped-user@budibase.com",
      builder: { global: false },
      admin: { global: false },
      roles: {
        [config.getProdWorkspaceId()]: roles.BUILTIN_ROLE_IDS.BASIC,
      },
    })

    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await sdk.ai.channelIdentities.upsert({
        provider: "msteams",
        externalUserId: "teams-user-1",
        tenantId: "tenant-1",
        globalUserId: mappedUser._id!,
        displayName: "Mapped Teams User",
      })
    })

    const result = await resolveWebhookAuthorization({
      workspaceId: config.getProdWorkspaceId(),
      chatAppId: "chatapp-teams",
      agentId: agent._id!,
      provider: "msteams",
      externalUserId: "teams-user-1",
      externalUserName: "Mapped Teams User",
      channel: {
        provider: "msteams",
        tenantId: "tenant-1",
        teamId: "team-1",
        channelId: "channel-1",
        externalUserId: "teams-user-1",
      },
    })

    expect(result.chatUserId).toEqual(mappedUser._id)
    expect(result.contextUser.roleId).toEqual(roles.BUILTIN_ROLE_IDS.BASIC)
  })

  it("rejects Teams users that are not linked", async () => {
    const agent = await provisionMappedTeamsAgent()

    await expect(
      resolveWebhookAuthorization({
        workspaceId: config.getProdWorkspaceId(),
        chatAppId: "chatapp-teams",
        agentId: agent._id!,
        provider: "msteams",
        externalUserId: "teams-user-unmapped",
        externalUserName: "Unmapped Teams User",
        channel: {
          provider: "msteams",
          tenantId: "tenant-1",
          teamId: "team-1",
          channelId: "channel-1",
          externalUserId: "teams-user-unmapped",
        },
      })
    ).rejects.toThrow("not linked to a Budibase user")
  })

  it("rejects mapped users without workspace access", async () => {
    const agent = await provisionMappedTeamsAgent()
    const noAccessUser = await config.createUser({
      email: "no-access@budibase.com",
      builder: { global: false },
      admin: { global: false },
      roles: {},
    })

    await config.doInContext(config.getProdWorkspaceId(), async () => {
      await sdk.ai.channelIdentities.upsert({
        provider: "msteams",
        externalUserId: "teams-user-no-access",
        tenantId: "tenant-1",
        globalUserId: noAccessUser._id!,
        displayName: "No Access User",
      })
    })

    await expect(
      resolveWebhookAuthorization({
        workspaceId: config.getProdWorkspaceId(),
        chatAppId: "chatapp-teams",
        agentId: agent._id!,
        provider: "msteams",
        externalUserId: "teams-user-no-access",
        externalUserName: "No Access User",
        channel: {
          provider: "msteams",
          tenantId: "tenant-1",
          teamId: "team-1",
          channelId: "channel-1",
          externalUserId: "teams-user-no-access",
        },
      })
    ).rejects.toThrow("does not have access to this workspace")
  })

  it("enforces Discord allowlists", async () => {
    const agent = await config.api.agent.create({
      name: "Discord Allowlist Agent",
      discordIntegration: {
        applicationId: "discord-app-id",
        publicKey: "discord-public-key",
        botToken: "discord-bot-token",
        guildId: "guild-setup",
        chatAppId: "chatapp-discord",
        allowedGuildIds: ["guild-allowed"],
      },
    })
    await config.publish()

    await expect(
      resolveWebhookAuthorization({
        workspaceId: config.getProdWorkspaceId(),
        chatAppId: "chatapp-discord",
        agentId: agent._id!,
        provider: "discord",
        externalUserId: "discord-user-1",
        externalUserName: "Discord User",
        channel: {
          provider: "discord",
          guildId: "guild-denied",
          channelId: "channel-1",
          externalUserId: "discord-user-1",
        },
      })
    ).rejects.toThrow("Discord guild is not allowed for this agent channel")
  })
})
